FROM nvidia/cuda:12.8.0-runtime-ubuntu24.04 AS base

# System deps: espeak-ng for phonemizer, libsndfile for audio
RUN apt-get update && apt-get install -y --no-install-recommends \
    espeak-ng \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Install uv from official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Install dependencies first (cached layer)
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=bind,source=.python-version,target=.python-version \
    uv sync --locked --no-install-project --no-dev

# Copy app code
COPY . /app

# Install the project itself
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

# HuggingFace cache goes to a volume
ENV HF_HOME=/cache/huggingface
ENV UV_LINK_MODE=copy

EXPOSE 7870

CMD ["uv", "run", "main.py"]
