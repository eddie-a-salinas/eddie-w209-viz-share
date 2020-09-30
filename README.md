# w209-su2020-cybersec
w209-su-cybersec

## To replicate

1.  Clone this repo

```
https://github.com/eddie-a-salinas/eddie-w209-viz-share.git
```

2.  Download the data

Find 3 files in the google drive folder link here:

https://drive.google.com/drive/folders/1-SCg7OhxOCkvldHgjTC5DwlRxmd0E3yq?usp=sharing

and download them to the *data* directory in the repo.

Additionally download the *memo_party* data as a folder and store it in the data directory.
After download the data directory should look like this (note that files/lines of the form
w?d?pp.(Senate|House).\d{3}.json have been removed for brevity and clarity having
been replaced with "..."

```
esalina@2018comp:/mnt/five_tera/eddie-w209-viz-share$ tree data/
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
