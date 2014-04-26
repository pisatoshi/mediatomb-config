////////////////////////////////////////////////////////////
//
//
function addAudio(obj)
{
    var desc = '';
    var artist_full;
    var album_full;

    // first gather data
    var title = obj.meta[M_TITLE];
    if (!title) title = obj.title;

    var artist = obj.meta[M_ARTIST];
    if (!artist)
    {
        artist = 'Unknown';
        artist_full = null;
    }
    else
    {
        artist_full = artist;
        desc = artist;
    }

    var album = obj.meta[M_ALBUM];
    if (!album)
    {
        album = 'Unknown';
        album_full = null;
    }
    else
    {
        desc = desc + ', ' + album;
        album_full = album;
    }

    if (desc)
        desc = desc + ', ';

    desc = desc + title;

    var date = obj.meta[M_DATE];
    if (!date)
    {
        date = 'Unknown';
    }
    else
    {
        date = getYear(date);
        desc = desc + ', ' + date;
    }

    var genre = obj.meta[M_GENRE];
    if (!genre)
    {
        genre = 'Unknown';
    }
    else
    {
        desc = desc + ', ' + genre;
    }

    var description = obj.meta[M_DESCRIPTION];
    if (!description)
    {
        obj.meta[M_DESCRIPTION] = desc;
    }

// uncomment this if you want to have track numbers in front of the title
// in album view
/*
    var track = obj.meta[M_TRACKNUMBER];
    if (!track)
        track = '';
    else
    {
        if (track.length == 1)
        {
            track = '0' + track;
        }
        track = track + ' ';
    }
*/
    // comment the following line out if you uncomment the stuff above  :)
    var track = '';

    var chain = new Array('Audio', 'All Audio');
    obj.title = title;
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC);

    chain = new Array('Audio', 'Artists', artist, 'All Songs');
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC);

    chain = new Array('Audio', 'All - full name');
    var temp = '';
    if (artist_full)
        temp = artist_full;

    if (album_full)
        temp = temp + ' - ' + album_full + ' - ';

    obj.title = temp + title;
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC);

    chain = new Array('Audio', 'Artists', artist, 'All - full name');
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC);

    chain = new Array('Audio', 'Artists', artist, album);
    obj.title = track + title;
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ALBUM);

    chain = new Array('Audio', 'Albums', album);
    obj.title = track + title;
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ALBUM);

    chain = new Array('Audio', 'Genres', genre);
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_GENRE);

    chain = new Array('Audio', 'Year', date);
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC);
}


////////////////////////////////////////////////////////////
//
//
function addVideo(obj)
{
    var title = obj.meta[M_TITLE];
    if (!title) title = obj.title;
    if (!title) {
        var location = obj.location;
        var arr = location.split('/');
        var u_path = arr[arr.length -1];
        title = u_path;
    }

    var album = obj.meta[M_ALBUM];
    if (!album)
    {
        var location = obj.location;
        var arr = location.split('/');
        var u_path = arr[arr.length -2];
        album = u_path;
    }

    var date = obj.meta[M_DATE];
    if (!date)
    {
        date = '';
    }
    else
    {
        date = getYear(date);
    }

    var genre = obj.meta[M_GENRE];
    if (!genre)
    {
       var location = obj.location;
       var arr = location.split('/');
       var u_path = arr[arr.length -3];
       genre = u_path;
    }

    var track = obj.meta[M_TRACKNUMBER];
    if (!track)
    {
        track = '';
        var location = obj.location;
        var arr = location.split('_#');
        if (arr.length > 1) {
            location = arr[arr.length - 1];
            arr = location.split('.');
            track = arr[arr.length - 2];
        }
    }
    else
    {
        if (track.length == 1)
        {
            track = '0' + track;
        }
    }
    if (track && track != '') {
        track = track + ' - ';
    }

    var description = obj.meta[M_DESCRIPTION];
    if (!description)
    {
        description = '';
    }

    var chain = new Array('ビデオ', 'ジャンル', genre, album);
    obj.title = track + title;
    addCdsObject(obj, createContainerChain(chain));

    if (description && description != '') {

        var key = '';
        var hasIndex = false;
        var hasTag   = false;
        var ary = description.split("\n");
        for (var i = 0; i < ary.length; i++) {
            var line = ary[i];
            line = line.replace('\r', '');

            if (line == '') {
                continue;
            }

            key = '@Index:';
            if (line.indexOf(key) == 0) {
                var value = line.substring(key.length);
                if (value != "") {
                    var chain = new Array('ビデオ', '50音', '[' + value + ']', album);
                    obj.title = track + title;
                    addCdsObject(obj, createContainerChain(chain));
                    hasIndex = true;
                }
            }

            key = '@Tag:';
            if (line.indexOf(key) == 0) {
                var value = line.substring(key.length);
                if (value != "") {
                    var chain = new Array('ビデオ', 'タグ', value, album);
                    obj.title = track + title;
                    addCdsObject(obj, createContainerChain(chain));
                    hasTag = true;
                }
            }
        }
        if (!hasIndex) {
            var chain = new Array('ビデオ', '50音', '[*]', album);
            obj.title = track + title;
            addCdsObject(obj, createContainerChain(chain));
        }
        if (!hasTag) {
            var chain = new Array('ビデオ', 'タグ', '*タグなし', album);
            obj.title = track + title;
            addCdsObject(obj, createContainerChain(chain));
        }
    } else {
        var chain = new Array('ビデオ', '50音', '[*]', album);
        obj.title = track + title;
        addCdsObject(obj, createContainerChain(chain));

        var chain = new Array('ビデオ', 'タグ', '*タグなし', album);
        obj.title = track + title;
        addCdsObject(obj, createContainerChain(chain));
    }

    if (date && date != '') {
        var chain = new Array('ビデオ', '年代', date, album);
        obj.title = track + title;
        addCdsObject(obj, createContainerChain(chain));
    } else {
        var chain = new Array('ビデオ', '年代', '不明', album);
        obj.title = track + title;
        addCdsObject(obj, createContainerChain(chain));
    }
}


////////////////////////////////////////////////////////////
//
//
function addImage(obj)
{
    var chain = new Array('Photos', 'All Photos');
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);

    var date = obj.meta[M_DATE];
    if (date)
    {
        chain = new Array('Photos', 'Date', date);
        addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
    }
}


////////////////////////////////////////////////////////////
// main script part
//

if (getPlaylistType(orig.mimetype) == '')
{
    var arr = orig.mimetype.split('/');
    var mime = arr[0];

    // var obj = copyObject(orig);

    var obj = orig;
    obj.refID = orig.id;

    if (mime == 'audio')
    {
        addAudio(obj);
    }

    if (mime == 'video')
    {
        addVideo(obj);
    }

    if (mime == 'image')
    {
        addImage(obj);
    }

    if (orig.mimetype == 'application/ogg')
    {
        if (orig.theora == 1)
            addVideo(obj);
        else
            addAudio(obj);
    }
}
