from app.services.wrapper import res_wrapper
from app.services.book import BookService
from app.services.discount import DiscountService
from app.repository.order_item import OrderItemRepository
from app.models.order_item import (
    OrderItem,
    OrderItemInput,
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
                price=item.final_price,
                book_id=item.book_id,
                order_id=order_id,
            )
            for item in items
        ]
        self.repository.add_range(mapped_items)

    def validate_item(
        self, item_input: OrderItemInput
    ) -> OrderItemValidateOutput:
        validated_item = OrderItemValidateOutput(**item_input.model_dump())
        quantity_flag = self.__validate_quantity(item_input, validated_item)
        book_flag = self.__validate_book(item_input, validated_item)
        if book_flag:
            self.__validate_discount(item_input, validated_item)
        if validated_item.cart_price != validated_item.final_price:
            validated_item.exception_details.append(
                "Price applied to cart doesn't match the final price"
            )
        return validated_item

    def __validate_quantity(
        self,
        item_input: OrderItemInput,
        validated_item: OrderItemValidateOutput = OrderItemValidateOutput(),
    ) -> bool:
        if item_input.quantity <= 0:
            validated_item.exception_details.append(
                "Item quantity can't be 0 nor negative")
            return False
        elif item_input.quantity > settings.MAX_ITEM_QUANTITY:
            validated_item.exception_details.append(
                f"Item quantity can't be larger than {settings.MAX_ITEM_QUANTITY}")
            return False
        else:
            return True

    def __validate_book(
        self,
        item_input: OrderItemInput,
        validated_item: OrderItemValidateOutput = OrderItemValidateOutput(),
    ) -> bool:
        book_res = (
            self.book_service.get_by_id(item_input.book_id)
            if item_input.book_id != None
            else None
        )
        if not book_res.is_success:
            validated_item.exception_details.append("Book isn't available")
            return False
        else:
            validated_item.book_price = book_res.result.book_price
            validated_item.final_price = validated_item.book_price
            return True

    def __validate_discount(
        self,
        item_input: OrderItemInput,
        validated_item: OrderItemValidateOutput = OrderItemValidateOutput(),
    ) -> bool:
        discount_res = self.discount_service.get_by_id(
            item_input.discount_id
        )
        if not discount_res.is_success:
            validated_item.exception_details.append("Discount isn't available")
            return False
        elif discount_res.result.book_id != item_input.book_id:
            validated_item.exception_details.append(
                "Discount doesn't apply to this book"
            )
            return False
        else:
            now = datetime.now()
            if discount_res.result.discount_start_date > now:
                validated_item.exception_details.append(
                    "Discount isn't ongoing"
                )
                return False
            elif discount_res.result.discount_end_date and discount_res.result.discount_end_date < now:
                validated_item.exception_details.append("Discount is expired")
                return False
        validated_item.final_price = discount_res.result.discount_price
        return True
