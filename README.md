Testing creating 6K arrays with 57600 entries each.

Initially took > 20 sec with non-typed arrays storing ints and floats.

Using sharedArrayBuffer typed arrays were very fast, < ~1 sec.
With workers, < ~0.5 sec.

The sharedArrayBuffer typed arrays consumed 48% less memory.
