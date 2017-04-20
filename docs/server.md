# photo-stream server

## receiving new pohto

* add sha to list
* send update to devices

## optimisations

* could use bittorrent/webtorrent for the shares

## notes

* it would be possible to get a version of this working without any server to
hold the list of shas, but then you would only get updates if someone who was
online when the photo was added. also keeping them in sync might be difficult.
though that could perhaps be achieved with sortable time sensitive uuid
