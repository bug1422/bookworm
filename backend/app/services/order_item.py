from app.services.wrapper import async_res_wrapper
from app.services.book import BookService
from app.services.discount import DiscountService
from app.repository.order_item import OrderItemRepository
from app.models.order_item import OrderItem, OrderItemInput, OrderItemValidateOutput
from datetime import datetime, timezone


class OrderItemService():
    def __init__(self,
                 item_repository: OrderItemRepository,
                 book_service: BookService,
                 discount_service: DiscountService,
                 ):
        self.repository = item_repository
        self.book_service = book_service
        self.discount_service = discount_service

    @async_res_wrapper
    async def add_items(self, order_id: int, items: list[OrderItemValidateOutput]):
        mapped_items = [
            OrderItem(
                quantity=item.quantity,
                price=item.final_price,
                book_id=item.book_id,
                order_id=order_id
            ) for item in items
        ]
        await self.repository.add_range(mapped_items)

    async def validate_item(self, item_input: OrderItemInput) -> OrderItemValidateOutput:
        validated_item = OrderItemValidateOutput(
            **item_input.model_dump())
        await self.__validate_book(item_input, validated_item)
        if len(validated_item.exception_details) == 0:
            await self.__validate_discount(item_input, validated_item)

        if validated_item.cart_price != validated_item.final_price:
            validated_item.exception_details.append(
                "Price applied to cart doesn't match the final price")

        return validated_item

    async def __validate_book(self, item_input: OrderItemInput, validated_item: OrderItemValidateOutput = OrderItemValidateOutput()) -> list[str]:
        book = await self.book_service.get_by_id(item_input.book_id) if item_input.book_id != None else None
        if not book:
            validated_item.exception_details.append("Book isn't available")
        validated_item.book_price = book.book_price
        validated_item.final_price = validated_item.book_price
        return validated_item

    async def __validate_discount(self, item_input: OrderItemInput, validated_item: OrderItemValidateOutput = OrderItemValidateOutput()) -> list[str]:
        discount = await self.discount_service.get_by_id(item_input.discount_id)
        if not discount:
            validated_item.exception_details.append("Discount isn't available")
        elif discount.book_id != item_input.book_id:
            validated_item.exception_details.append(
                "Discount doesn't apply to this book")
        else:
            now = datetime(timezone.utc)
            if discount.discount_start_date > now:
                validated_item.exception_details.append(
                    "Discount isn't ongoing")
            elif discount.discount_end_date < now:
                validated_item.exception_details.append("Discount is expired")
        validated_item.final_price = discount.discount_price
        return validated_item
