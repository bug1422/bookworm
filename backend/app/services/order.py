from app.services.wrapper import res_wrapper
from app.services.order_item import OrderItemService
from app.services.user import UserService
from app.repository.order import OrderRepository
from app.models.order import Order, OrderValidateOutput
from app.models.order_item import OrderItemValidateOutput, OrderItemValidateInput, OrderItemCheckoutInput
from app.models.exception import OrderValidationException

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

    @res_wrapper
    def add_order(self, user_id: int, order_items: list[OrderItemCheckoutInput]) -> Order:
        user_res = self.user_service.get_user_info(user_id)
        if not user_res.is_success:
            raise user_res.exception
        validated_items: list[OrderItemValidateOutput] = []
        is_valid: bool = True
        for item in order_items:
            validated_item = self.item_service.validate_item(item)
            if len(validated_item.exception_details) != 0:
                is_valid = False
            validated_items.append(validated_item)
        exception_details = []
        self.__validate_unique_items(order_items, exception_details)
        if not is_valid or exception_details:
            raise OrderValidationException(order_output=OrderValidateOutput(exception_details=exception_details,validated_items=validated_items))
        total_price = sum([item.total_price for item in validated_items])
        order = Order(user_id = user_id, order_amount=total_price)
        self.repository.add(order)
        self.repository.flush()
        self.repository.refresh(order)
        add_items_res = self.item_service.add_items(order_id=order.id,items=validated_items)
        if not add_items_res.is_success:
            # rollback
            self.repository.rollback()
            raise add_items_res.exception
        self.repository.commit()
        self.repository.refresh(order)
        return order

    @res_wrapper
    def validate_order(
        self, order_items: list[OrderItemValidateInput]
    ) -> OrderValidateOutput:
        exception_details = []
        self.__validate_unique_items(order_items, exception_details)
        validated_items = [
            self.item_service.validate_item(item)
            for item in order_items
        ]
        return OrderValidateOutput(exception_details=exception_details, validated_items=validated_items)

    def __validate_unique_items(self, order_items: list[OrderItemValidateInput], exception_details: list[str]):
        if len(order_items) != len(set([item.book_id for item in order_items])):
            exception_details.append("List can't contain duplicate id")
            return False
        return True
