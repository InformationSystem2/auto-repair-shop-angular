FROM ubuntu:latest
LABEL authors="nak"

ENTRYPOINT ["top", "-b"]
