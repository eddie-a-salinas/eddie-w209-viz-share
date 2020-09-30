# w209-su2020-cybersec
w209-su-cybersec

## To replicate

1.  Clone this repo

>git clone https://github.com/eddie-a-salinas/eddie-w209-viz-share.git

2.  Download the data

Find 3 files in the google drive folder link here:

https://drive.google.com/drive/folders/1-SCg7OhxOCkvldHgjTC5DwlRxmd0E3yq?usp=sharing

and download them to the *data* directory in the repo.

Additionally download the *memo_party* data as a folder and store it in the data directory.
After download the data directory should look like this (note that files/lines of the form
w?d?pp.(Senate|House).\d{3}.json have been removed for brevity and clarity having
been replaced with "..."

```
data/
├── cols.dat
├── demrep35_113.json
├── demrep35j_113_clean.csv
├── demrep35j_113.json
├── dpre_proc_1.py
├── dpre_proc_2.py
├── hdemrep35_113.dat
├── house_vote.csv
├── memo_party
│   ├── add_date.py
│   ├── dl_memo.sh
│   ├── pp.House.001.json
│   ├── pp.House.002.json
...
│   ├── pp.House.115.json
│   ├── pp.House.116.json
│   ├── pp.Senate.001.json
│   ├── pp.Senate.002.json
...
│   ├── pp.Senate.115.json
│   ├── pp.Senate.116.json
│   ├── wdpp.House.001.json
│   ├── wdpp.House.002.json
...
│   ├── wdpp.House.116.json
│   ├── wdpp.Senate.001.json
│   ├── wdpp.Senate.002.json
...
│   ├── wdpp.Senate.114.json
│   ├── wdpp.Senate.115.json
│   └── wdpp.Senate.116.json
├── sdemrep35_113.dat
└── senate_vote.csv

```

3.  Build the docker image

cd into the docker directory and build the image.
Optionally tag it for "human friendly" docker image management.

>esalina@2018comp:/mnt/five_tera/eddie-w209-viz-share/docker$ ll
>total 12
>drwxr-xr-x  2 esalina esalina 4096 Sep 30 11:11 ./
>drwxr-xr-x 10 esalina esalina 4096 Sep 30 12:13 ../
>-rw-r--r--  1 esalina esalina  573 Sep 30 11:11 Dockerfile
>esalina@2018comp:/mnt/five_tera/eddie-w209-viz-share/docker$ docker build . -t myw209flaskimg
>Sending build context to Docker daemon  3.584kB
>Step 1/7 : FROM python:3.8.6
> ---> bbf31371d67d
>Step 2/7 : RUN python3 -m pip install numpy===1.19.2
> ---> Using cache
> ---> b0ae4a1b0137
>Step 3/7 : RUN python3 -m pip install pandas===1.1.2
> ---> Using cache
> ---> 5903e2168ae6
>Step 4/7 : RUN python3 -m pip install werkzeug===1.0.1
> ---> Using cache
> ---> 1a0e62ce916c
>Step 5/7 : RUN python3 -m pip install flask===1.1.2
> ---> Using cache
> ---> 492fbca17d5e
>Step 6/7 : COPY run_site.sh /usr/local/bin/
> ---> Using cache
> ---> 4abd0df0063f
>Step 7/7 : CMD /usr/local/bin/run_site.sh
> ---> Using cache
> ---> 649927be27a4
>Successfully built 649927be27a4
>Successfully tagged myw209flaskimg:latest

4.  From the *root* directory of the project run the image in a container being sure to open ports appropriately
(-p 5000:5000) and mount the file system appropriately so that the root of the repo is in /work.

```
esalina@2018comp:/mnt/five_tera/eddie-w209-viz-share$ pwd
/mnt/five_tera/eddie-w209-viz-share
esalina@2018comp:/mnt/five_tera/eddie-w209-viz-share$ docker run --rm -p 5000:5000 -it -v ${PWD}:/work:ro myw209flaskimg:latest
+ cd /work
+ env FLASK_APP=w209_final_project_flask.py FLASK_ENV=development flask run --host 0.0.0.0
 * Serving Flask app "w209_final_project_flask.py" (lazy loading)
 * Environment: development
 * Debug mode: on
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 885-723-612
172.17.0.1 - - [30/Sep/2020 17:44:58] "GET / HTTP/1.1" 200 -
172.17.0.1 - - [30/Sep/2020 17:44:58] "GET /rc_detail/35/1/House HTTP/1.1" 200 -
172.17.0.1 - - [30/Sep/2020 17:44:58] "GET /rc_detail/35/1/Senate HTTP/1.1" 200 -
172.17.0.1 - - [30/Sep/2020 17:44:58] "GET /getMemberVote/35/1/senate HTTP/1.1" 200 -
172.17.0.1 - - [30/Sep/2020 17:44:58] "GET /getVotesPerCongress/senate HTTP/1.1" 200 -
172.17.0.1 - - [30/Sep/2020 17:44:59] "GET /getVotesPerCongress/house HTTP/1.1" 200 -
172.17.0.1 - - [30/Sep/2020 17:44:59] "GET /getTotalRollcallsPerCongress/senate HTTP/1.1" 200 -
172.17.0.1 - - [30/Sep/2020 17:44:59] "GET /getTotalRollcallsPerCongress/house HTTP/1.1" 200 -

```


