import os
from fastapi.templating import Jinja2Templates

# onde estao os htmls
pasta = os.path.dirname(os.path.abspath(__file__))
# configura o jinja
templates = Jinja2Templates(directory=os.path.join(pasta, "templates"))
