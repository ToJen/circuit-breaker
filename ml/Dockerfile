# Use an official Python runtime as a parent image, assuming Python 3.12 is available
FROM python:3.11

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies
# python3-distutils is usually included in the standard library, but if you run into issues,
# you might need to install it or other dependencies here.
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     libffi-dev \
#     && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

# Install virtualenv
RUN pip install --no-cache-dir virtualenv

# Create a virtual environment in the directory /usr/src/app/venv
RUN python -m venv venv

# Activate the virtual environment
ENV VIRTUAL_ENV /usr/src/app/venv
ENV PATH /usr/src/app/venv/bin:$PATH

# Ensure that we are using the virtualenv
RUN which pip

# Copy the current directory contents into the container at /usr/src/app
COPY . .

RUN pip install --upgrade pip

# Install any needed packages specified in requirements.txt into the virtual environment
RUN pip install --no-cache-dir -r requirements.txt

# Run app.py when the container launches
CMD ["python", "./main.py"]
