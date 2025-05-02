from app.models.order import OrderValidateOutput
class NotFoundException(Exception):
    def __init__(self, entity):
        super().__init__(f"{entity} not found")
        
class OrderValidationException(Exception):
    def __init__(self, *args, order_output: OrderValidateOutput):
        formatted_order_output = f"Validation details: {order_output.exception_details}"
        new_args = args + (formatted_order_output,)
        super().__init__(*new_args)
        self.validation = order_output.exception_details
        self.item_validations = [item.exception_details for item in order_output.validated_items]