from sqlmodel import SQLModel
from enum import Enum
from decimal import Decimal
from app.core.config import settings


class Currency(Enum):
    UNITED_STATES_DOLLAR = ("USD", 1, "$_")
    VIETNAM_DONG = ("VND", settings.EXCHANGE_RATE_USD_VND, "_vnd")

    def __init__(self, value, exchange_rate, symbol):
        self._value_ = value
        self.exchange_rate = exchange_rate
        self.symbol = symbol


def get_currency(value: Decimal):
    return float(value)


class MoneyOptions(SQLModel):
    currencies: dict[str, dict] = []
