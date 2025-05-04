from app.models.order import OrderValidateOutput, OrderItemValidateOutput


class NotFoundException(Exception):
    def __init__(self, entity):
        super().__init__(f"{entity} not found")


class OrderValidationException(Exception):
    def __init__(self, order_output: OrderValidateOutput):
        super().__init__()
        self.exception_details = order_output.exception_details
        self.validated_items: list[OrderItemValidateOutput] = order_output.validated_items

    def get_detail_string(self):
        all_errors = ["cart:"+exception for exception in self.exception_details] + \
            [f"{item.book_id}:"+exception for item in self.validated_items for exception in item.exception_details]
        return "|".join(filter(None, all_errors))
