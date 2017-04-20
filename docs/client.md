# photo-stream client

## adding photo

* take photo or select from advice
* add photo to app-local data as blib
* sha-latest sum photo
* send sum to server
* add photo to stream

## responding to requests

* get a request for a sha
* if you have a photo matching that sha then send it along

## requesting new photo

* get notified of a new shasum
* ask other members of stream for the photo
* get the photo

## optimisations

* could use bittorrent/webtorrent for the shares

## notes

* the server never *ever* sees the photos, not even during transmission. it's
just a record of what to send.
* perhaps the server never even needs this record. in a later version perhaps
the list of shas should also be shared peer to peer
