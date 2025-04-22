from functools import wraps
from dataclasses import dataclass
from typing import Optional, Any, TypeVar, Callable, Awaitable, Generic

P = TypeVar("P")


@dataclass
class ServiceResponse(Generic[P]):
    is_success: bool
    result: Optional[P] = None
    exception: Optional[Exception] = None

    @staticmethod
    def success(result: P):
        return ServiceResponse(is_success=True, result=result)

    @staticmethod
    def fail(exception):
        return ServiceResponse[Any](is_success=False, exception=exception)


def async_res_wrapper(func: Callable[..., Awaitable[P]]):
    @wraps(func)
    async def async_wrapper(*args, **kwargs) -> ServiceResponse[P]:
        try:
            res: P = await func(*args, **kwargs)  # Await async function
            return ServiceResponse.success(res)
        except Exception as e:
            return ServiceResponse.fail(e)

    return async_wrapper
