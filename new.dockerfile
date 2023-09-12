FROM python:3.11.4-bookworm
WORKDIR /root/code 

RUN pip3 install dash
RUN pip3 install dash_bootstrap_components
RUN pip3 install dash_bootstrap_components[pandas]
RUN pip3 install --upgrade pip
RUN pip3 install ipykernel
RUN pip3 install scikit-learn
RUN pip3 install numpy
RUN pip3 install pandas
RUN pip3 install mlflow
RUN pip3 install --upgrade setuptools
COPY ./source_code /root/code
CMD tail -f /dev/null