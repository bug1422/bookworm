from app.services.wrapper import async_res_wrapper
from app.services.order_item import OrderItemService
from app.services.user import UserService
from app.repository.order import OrderRepository
from app.models.order import Order, OrderInput, OrderItemInput, OrderValidateOutput


class OrderService:
    def __init__(
        self,
        order_repository: OrderRepository,
        user_service: UserService,
        item_service: OrderItemService,
    ):
        self.repository = order_repository
        self.user_service = user_service
        self.item_service = item_service

    @async_res_wrapper
    async def add_order(self, order_input: OrderInput, user_id: int) -> Order:
        user_res = await self.user_service.get_user_info(user_id)
        if not user_res.is_success:
            raise user_res.exception
        validated_items = []
        is_valid: bool = True
        for item in order_input.items:
            validated_item = await self.item_service.validate_item(item)
            if len(validated_item.exception_details) != 0:
                is_valid = False
            else:
                validated_items.append(validated_item)
        if not is_valid:
            # Replace this with a custom cart validating error
            self.repository.rollback()
            raise Exception("")
            # rollback
        total_price = sum([item.final_price for item in validated_items])
        order = Order(order_amount=total_price)
        await self.repository.add(order)
        add_items_res = await self.item_service.add_items()
        if not add_items_res.is_success:
            # rollback
            self.repository.rollback()
            raise add_items_res.exception
        self.repository.commit()
        self.repository.refresh(order)
        return order

    @async_res_wrapper
    async def validate_order(
        self, order_items: list[OrderItemInput]
    ) -> OrderValidateOutput:
        exception_details = []
        self.__validate_unique_items(order_items,exception_details)
        validated_items = [
            await self.item_service.validate_item(item)
            for item in order_items
        ]
        return OrderValidateOutput(exception_details=exception_details,validated_items=validated_items)

    def __validate_unique_items(self, order_items: list[OrderItemInput],exception_details: list[str]):
        if len(order_items) != len(set([item.book_id for item in order_items])):
            exception_details.append("List can't contain duplicate id")
            return False
        return True