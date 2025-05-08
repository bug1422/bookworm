from decimal import Decimal
from enum import Enum

from sqlmodel import SQLModel

from app.core.config import settings


class Currency(Enum):
    UNITED_STATES_DOLLAR = ("USD", 1, "en-US")
    VIETNAM_DONG = ("VND", settings.EXCHANGE_RATE_USD_VND, "vi-VN")

    def __init__(self, value, exchange_rate, region_code):
        self._value_ = value
        self.exchange_rate = exchange_rate
        self.region_code = region_code


def get_currency(value: Decimal):
    return float(value)


class MoneyOptions(SQLModel):
    currencies: dict[str, dict] = []
