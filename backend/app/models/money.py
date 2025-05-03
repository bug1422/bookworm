from enum import Enum
from decimal import Decimal

class Currency(Enum):
    UNITED_STATES_DOLLAR = "USD"


def get_currency(value: Decimal, currency: Currency = Currency.UNITED_STATES_DOLLAR):
    if currency == Currency.UNITED_STATES_DOLLAR:
        formatted_string = f"${value:.2f}"  # Formats as "$12.00"
    else:
        formatted_string = str(value)

    return {
        "value": float(value),
        "formatted_string": formatted_string
    }