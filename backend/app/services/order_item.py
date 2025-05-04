from app.core.image import get_image_url
from app.services.wrapper import res_wrapper
from app.services.book import BookService
from app.services.discount import DiscountService
from app.repository.order_item import OrderItemRepository
from app.models.order_item import (
    OrderItem,
    OrderItemValidateInput,
    OrderItemCheckoutInput,
    OrderItemValidateOutput,
)
from app.core.config import settings
from datetime import datetime, timezone


class OrderItemService:
    def __init__(
        self,
        item_repository: OrderItemRepository,
        book_service: BookService,
        discount_service: DiscountService,
    ):
        self.repository = item_repository
        self.book_service = book_service
        self.discount_service = discount_service

    @res_wrapper
    def add_items(
        self, order_id: int, items: list[OrderItemValidateOutput]
    ):
        mapped_items = [
            OrderItem(
                quantity=item.quantity,
                price=item.total_price,
                book_id=item.book_id,
                order_id=order_id,
            )
            for item in items
        ]
        self.repository.add_range(mapped_items)

    def validate_item(
        self, item_input: OrderItemValidateInput | OrderItemCheckoutInput
    ) -> OrderItemValidateOutput:
        validated_item = OrderItemValidateOutput(**item_input.model_dump())
        quantity_flag = self.__validate_quantity(item_input, validated_item)
        book_flag = self.__validate_book(item_input, validated_item)
        if not book_flag:
            return validated_item
        self.__validate_discount(item_input, validated_item)
        validated_item.total_price = validated_item.final_price * validated_item.quantity
        if isinstance(item_input, OrderItemCheckoutInput) and validated_item.total_price != item_input.cart_price:
            validated_item.exception_details.append(
                "Book price doesn't match final price")
        validated_item.is_on_sale=validated_item.final_price < validated_item.book_price
        return validated_item

    def __validate_quantity(
        self,
        item_input: OrderItemValidateInput,
        validated_item: OrderItemValidateOutput = OrderItemValidateOutput(),
    ) -> bool:
        if item_input.quantity <= 0:
            validated_item.exception_details.append(
                "Item quantity can't be 0 nor negative")
            validated_item.available = False
            return False
        elif item_input.quantity > settings.MAX_ITEM_QUANTITY:
            validated_item.exception_details.append(
                f"Item quantity can't be larger than {settings.MAX_ITEM_QUANTITY}")
            validated_item.available = False
            return False
        else:
            return True

    def __validate_book(
        self,
        item_input: OrderItemValidateInput,
        validated_item: OrderItemValidateOutput = OrderItemValidateOutput(),
    ) -> bool:
        book_res = (
            self.book_service.get_by_id(item_input.book_id)
            if item_input.book_id != None
            else None
        )
        if not book_res.is_success:
            validated_item.exception_details.append("Book isn't available")
            validated_item.available = False
            return False
        else:
            validated_item.book_title = book_res.result.book_title
            validated_item.book_id = book_res.result.id
            validated_item.book_cover_photo = get_image_url(
                "books", book_res.result.book_cover_photo)
            validated_item.author_name = book_res.result.author.author_name
            validated_item.book_price = book_res.result.book_price
            validated_item.final_price = validated_item.book_price
            return True

    def __validate_discount(
        self,
        item_input: OrderItemValidateInput,
        validated_item: OrderItemValidateOutput = OrderItemValidateOutput(),
    ) -> bool:
        response = self.book_service.get_book_max_discount(item_input.book_id)
        if not response.is_success:
            validated_item.exception_details.append(str(response.exception))
            validated_item.available = False
            return False

        final_price, start_date, end_date = response.result
        validated_item.final_price = final_price
        validated_item.discount_start_date = start_date
        validated_item.discount_end_date = end_date
        return True
