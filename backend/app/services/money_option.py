from app.models.money import Currency, MoneyOptions
from app.services.wrapper import res_wrapper


class MoneyOptionSerivce:
    @res_wrapper
    def get_money_options(self) -> MoneyOptions:
        return MoneyOptions(
            currencies={
                currency.value: {
                    "exchange_rate": currency.exchange_rate,
                    "region_code": currency.region_code
                }
                for currency in Currency
            },
        )
