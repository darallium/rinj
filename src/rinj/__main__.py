import rinj
from rinj.app import app
import sys

sys.exit(rinj.main())

if __name__ == "__main__":
    app.run(debug=True)
