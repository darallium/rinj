from rinj.app import app


def main() -> int:
    app.run(debug=True)
    return 0
