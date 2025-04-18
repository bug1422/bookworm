from sqlmodel import SQLModel

class SearchOptions(SQLModel):
    author_names: list[str] = []
    category_names: list[str] = []
    rating_list: list[str] = []
    book_sort_option: dict[str,str] = {}
    review_sort_option: dict[str,str] = {}