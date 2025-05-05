from app.models.order import OrderValidateOutput, OrderItemValidateOutput


class NotFoundException(Exception):
    def __init__(self, entity):
        super().__init__(f"{entity} not found")


class OrderValidationException(Exception):
    def __init__(self, order_output: OrderValidateOutput):
        super().__init__()
        self.order_output = order_output
    def get_order_output(self):
        return self.order_output

    def get_detail_string(self):
        all_errors = ["cart:"+exception for exception in self.order_output.exception_details] + \
            [f"{item.book_id}:"+exception for item in self.order_output.validated_items for exception in item.exception_details]
        return "|".join(filter(None, all_errors))
