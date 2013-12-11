function _cobrowser_load() {
  
  var $co = jQuery.noConflict();

  (function ($) {
   
    Cobrowse = {
      debug: true,
      connected: false,
			updateInterval: 50,
			mice: [],
      me: { x: 0, y: 0, width: $(window).width(), height: $(window).height(), id: $.cookie("cobrowse_mouse_id") },
      log: function(log) { if (Cobrowse.debug) { console.log(log); } },
  
      createCta: function() {
        var cobrowse = $("<div>").attr("id", "cobrowse")
        var cta = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAABgCAYAAAAKGMITAAAKQWlDQ1BJQ0MgUHJvZmlsZQAASA2dlndUU9kWh8+9N73QEiIgJfQaegkg0jtIFQRRiUmAUAKGhCZ2RAVGFBEpVmRUwAFHhyJjRRQLg4Ji1wnyEFDGwVFEReXdjGsJ7601896a/cdZ39nnt9fZZ+9917oAUPyCBMJ0WAGANKFYFO7rwVwSE8vE9wIYEAEOWAHA4WZmBEf4RALU/L09mZmoSMaz9u4ugGS72yy/UCZz1v9/kSI3QyQGAApF1TY8fiYX5QKUU7PFGTL/BMr0lSkyhjEyFqEJoqwi48SvbPan5iu7yZiXJuShGlnOGbw0noy7UN6aJeGjjAShXJgl4GejfAdlvVRJmgDl9yjT0/icTAAwFJlfzOcmoWyJMkUUGe6J8gIACJTEObxyDov5OWieAHimZ+SKBIlJYqYR15hp5ejIZvrxs1P5YjErlMNN4Yh4TM/0tAyOMBeAr2+WRQElWW2ZaJHtrRzt7VnW5mj5v9nfHn5T/T3IevtV8Sbsz55BjJ5Z32zsrC+9FgD2JFqbHbO+lVUAtG0GQOXhrE/vIADyBQC03pzzHoZsXpLE4gwnC4vs7GxzAZ9rLivoN/ufgm/Kv4Y595nL7vtWO6YXP4EjSRUzZUXlpqemS0TMzAwOl89k/fcQ/+PAOWnNycMsnJ/AF/GF6FVR6JQJhIlou4U8gViQLmQKhH/V4X8YNicHGX6daxRodV8AfYU5ULhJB8hvPQBDIwMkbj96An3rWxAxCsi+vGitka9zjzJ6/uf6Hwtcim7hTEEiU+b2DI9kciWiLBmj34RswQISkAd0oAo0gS4wAixgDRyAM3AD3iAAhIBIEAOWAy5IAmlABLJBPtgACkEx2AF2g2pwANSBetAEToI2cAZcBFfADXALDIBHQAqGwUswAd6BaQiC8BAVokGqkBakD5lC1hAbWgh5Q0FQOBQDxUOJkBCSQPnQJqgYKoOqoUNQPfQjdBq6CF2D+qAH0CA0Bv0BfYQRmALTYQ3YALaA2bA7HAhHwsvgRHgVnAcXwNvhSrgWPg63whfhG/AALIVfwpMIQMgIA9FGWAgb8URCkFgkAREha5EipAKpRZqQDqQbuY1IkXHkAwaHoWGYGBbGGeOHWYzhYlZh1mJKMNWYY5hWTBfmNmYQM4H5gqVi1bGmWCesP3YJNhGbjS3EVmCPYFuwl7ED2GHsOxwOx8AZ4hxwfrgYXDJuNa4Etw/XjLuA68MN4SbxeLwq3hTvgg/Bc/BifCG+Cn8cfx7fjx/GvyeQCVoEa4IPIZYgJGwkVBAaCOcI/YQRwjRRgahPdCKGEHnEXGIpsY7YQbxJHCZOkxRJhiQXUiQpmbSBVElqIl0mPSa9IZPJOmRHchhZQF5PriSfIF8lD5I/UJQoJhRPShxFQtlOOUq5QHlAeUOlUg2obtRYqpi6nVpPvUR9Sn0vR5Mzl/OX48mtk6uRa5Xrl3slT5TXl3eXXy6fJ18hf0r+pvy4AlHBQMFTgaOwVqFG4bTCPYVJRZqilWKIYppiiWKD4jXFUSW8koGStxJPqUDpsNIlpSEaQtOledK4tE20Otpl2jAdRzek+9OT6cX0H+i99AllJWVb5SjlHOUa5bPKUgbCMGD4M1IZpYyTjLuMj/M05rnP48/bNq9pXv+8KZX5Km4qfJUilWaVAZWPqkxVb9UU1Z2qbapP1DBqJmphatlq+9Uuq43Pp893ns+dXzT/5PyH6rC6iXq4+mr1w+o96pMamhq+GhkaVRqXNMY1GZpumsma5ZrnNMe0aFoLtQRa5VrntV4wlZnuzFRmJbOLOaGtru2nLdE+pN2rPa1jqLNYZ6NOs84TXZIuWzdBt1y3U3dCT0svWC9fr1HvoT5Rn62fpL9Hv1t/ysDQINpgi0GbwaihiqG/YZ5ho+FjI6qRq9Eqo1qjO8Y4Y7ZxivE+41smsImdSZJJjclNU9jU3lRgus+0zwxr5mgmNKs1u8eisNxZWaxG1qA5wzzIfKN5m/krCz2LWIudFt0WXyztLFMt6ywfWSlZBVhttOqw+sPaxJprXWN9x4Zq42Ozzqbd5rWtqS3fdr/tfTuaXbDdFrtOu8/2DvYi+yb7MQc9h3iHvQ732HR2KLuEfdUR6+jhuM7xjOMHJ3snsdNJp9+dWc4pzg3OowsMF/AX1C0YctFx4bgccpEuZC6MX3hwodRV25XjWuv6zE3Xjed2xG3E3dg92f24+ysPSw+RR4vHlKeT5xrPC16Il69XkVevt5L3Yu9q76c+Oj6JPo0+E752vqt9L/hh/QL9dvrd89fw5/rX+08EOASsCegKpARGBFYHPgsyCRIFdQTDwQHBu4IfL9JfJFzUFgJC/EN2hTwJNQxdFfpzGC4sNKwm7Hm4VXh+eHcELWJFREPEu0iPyNLIR4uNFksWd0bJR8VF1UdNRXtFl0VLl1gsWbPkRoxajCCmPRYfGxV7JHZyqffS3UuH4+ziCuPuLjNclrPs2nK15anLz66QX8FZcSoeGx8d3xD/iRPCqeVMrvRfuXflBNeTu4f7kufGK+eN8V34ZfyRBJeEsoTRRJfEXYljSa5JFUnjAk9BteB1sl/ygeSplJCUoykzqdGpzWmEtPi000IlYYqwK10zPSe9L8M0ozBDuspp1e5VE6JA0ZFMKHNZZruYjv5M9UiMJJslg1kLs2qy3mdHZZ/KUcwR5vTkmuRuyx3J88n7fjVmNXd1Z752/ob8wTXuaw6thdauXNu5Tnddwbrh9b7rj20gbUjZ8MtGy41lG99uit7UUaBRsL5gaLPv5sZCuUJR4b0tzlsObMVsFWzt3WazrWrblyJe0fViy+KK4k8l3JLr31l9V/ndzPaE7b2l9qX7d+B2CHfc3em681iZYlle2dCu4F2t5czyovK3u1fsvlZhW3FgD2mPZI+0MqiyvUqvakfVp+qk6oEaj5rmvep7t+2d2sfb17/fbX/TAY0DxQc+HhQcvH/I91BrrUFtxWHc4azDz+ui6rq/Z39ff0TtSPGRz0eFR6XHwo911TvU1zeoN5Q2wo2SxrHjccdv/eD1Q3sTq+lQM6O5+AQ4ITnx4sf4H++eDDzZeYp9qukn/Z/2ttBailqh1tzWibakNml7THvf6YDTnR3OHS0/m/989Iz2mZqzymdLz5HOFZybOZ93fvJCxoXxi4kXhzpXdD66tOTSna6wrt7LgZevXvG5cqnbvfv8VZerZ645XTt9nX297Yb9jdYeu56WX+x+aem172296XCz/ZbjrY6+BX3n+l37L972un3ljv+dGwOLBvruLr57/17cPel93v3RB6kPXj/Mejj9aP1j7OOiJwpPKp6qP6391fjXZqm99Oyg12DPs4hnj4a4Qy//lfmvT8MFz6nPK0a0RupHrUfPjPmM3Xqx9MXwy4yX0+OFvyn+tveV0auffnf7vWdiycTwa9HrmT9K3qi+OfrW9m3nZOjk03dp76anit6rvj/2gf2h+2P0x5Hp7E/4T5WfjT93fAn88ngmbWbm3/eE8/syOll+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEImlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MTwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+NTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MzA8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjk2PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPGRjOnN1YmplY3Q+CiAgICAgICAgICAgIDxyZGY6QmFnLz4KICAgICAgICAgPC9kYzpzdWJqZWN0PgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxMy0xMS0yN1QxMzoxMTo1NjwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+UGl4ZWxtYXRvciAzLjA8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CsaU3c0AABLdSURBVGgF7Zp7jF3VdcbXPefcO3fu3BkGm7F5GIhjY0OqIhRDk0AUgpTQENpCQxSktCGR+gh9CKlNVSVKH1KEklQJVdqqSaUmjUQUJwVVxaC2LqZSysMkgMG8/KBgGGOPGT9nPHPnzn2d09+39jnz8jhUrtt/2j1z7jn3nL3Xt76111577X2P2f+1UoKwjv+Jkv00oaWVN3xmRylKzOLISiV0KMVoUrKMa2mk1os0i7iRZpZlGffTcJ2mlqVds16Xc8/SVuNIZ+LIjun9u/7WZidGczGc5ktp9W1/lJUiwOIEYKRGALoCQqAUCuQalDgDy4cOALMe4ALm3O1Y1utY2mlb1m2hwMx045Wn7pw9tHczkiRhriSl/jqgZRPrUgRrlBCY+DjnnG4pk0KhbWkOlFoO3AMQtoCWBJ60zNqJRVFcH9j43m+nJw+/0G6ceAnUOfCk1DcUgGEsc5uAgYykBGB8+PegqkysKwGmfhRsS5g6g2kKaNRJqBHREZKRVSvrrvl8+4WH76AhfRPAE+sbQMM+ByzFYivmehpZJrNT07mDGPqdts5YIoKZQcS0AEdtzF2mHiRo7y1RMBledQ1fxEhqu+pJ1hdMbZg7g20mJ9OfO5m3dcBAlE8ZAecSeGYAI1h9a1EXhZGB8mpPr1Ml9H1UHboASdKGBqEkabmKqatYWKD0i5gCLsZyNNfPHUzQMnG45cByKLEu4dElWENKvpHSRfL6rMuzmPtxRWjBBK46Rs6Sfn+QwdhwsBSwCLbuzVxLkJzJFSnRr0FhWONQYm6wLcm8yOVw9TTcEkwf491JxY8cOG8N/V7UB2M0klcnHGjdk7klwc0mUBXZmBNDx0uESj0xBjBm7OqmmOp5DKiUUfe5UrLy4gIwYHIowAXqno3mYVhRWWaGscY2J+5nlqJV5ABo0pMTooCqajwjKytVLIWt6Yz1Uh8pXmXuI+kZJkarSH3vDiXtRE0OxjkfUroM9znhNKnMDtss0lnPAEBOSX3NUNR3mT+FmHeDqiwoiTQKlVRR1+rj4AfyTgUVGXuor2Q/szKxNYOxvTHZtV2HWzZDnJA+cirJoCXgAGWBhA9J7rl/UGNhSdQ3Pj7RXg2lrRRwgnzWy5F98X0D9utX1qxWDnclQH51/+4Z+/2Hj9rJpgaPnIvnWEguqD85cuHlarOwYGoqpBy0i3wYBMeSec7B5x782LC958KKTcym9vTBGZjOWhlvf9eqqn10fdWuXXOh/eIPxuyVI5iY/hZ4pu7RQdG1wJeWJE2FyDFXQZU4oPT1G4Yc9O+eOWp/+OBrNtnEtl7gg2Ln1qt2zy+ts2/cuNJuvLfh4kvIE1AGGYVcv14GGNfASzFbzw+uuZDDXjxo9sl39dufPjJmv/HDPXai2cVT5a1V4nEfRors2FTTPrN5lx2cbNkvX1H3aNXD9SVPhHsytceAXN8FJwYHbFUUpaQpAlO89rYNFdtzpGVfeWTU0jJBprbS0oHVltbPs6w+YtnAiKXVYffaz23ZZzeuqzmgopb6OIWxFNC1huHSksgfSnFwBbFAV/eR9cORff+5o9YlsplmsHINx1NlqihuEDSMqKRxP96csap6q0PgUHtnrA++ucmXwoqnD1AqcY45Ilppjr14KLZdMI6qTCLVmllZgYZILuWkAEHBgwyKReWKVVA+H9C5XwUyurcMYYOxGqiSzCzD65zaBENkfJZnTCKRT3NUA9CFCFvcMKsmFwWJi4eJfEH/HBiWLjrIXwoeufKCQ5iChdiAa/sn27b+vJoz9Nu67xYRaFBUiqj+YF/kQ0zWcjA91zOROk2RDEaTnF6RWv0LCxo9uLdhV1+oKZOo5BZRvQDkrsBlwsWqWmL3fuwi23Fg2imqfZEi0Y/Sa1l877KCiWo5Oxxmx3jH1gwlHkTmrIFyEuTBkYqbzo/tyx8YBDyyf983KVM4AckLwdd1cTJLiSceHJEmz1Y/eKap5I+Y9qktb1l/rW7XXlC1dcOx7ZtM7VkUaml8cOw41LZn3zhqWXMK7+0ws1bxeLwdTTUspbBUke8sLbgqFdw86hdXmbroy1D51BUDds+HVlq9As28vHGyZ7/5cMMee3OWEMs87BkIbamvBDEtAdwFiO7zDvSm8+0LOYn6TX+hElcoodTnugv67Zs3Ddueo2277+WTtvtI2xrIvHyk3/78g4N225aOHTxZZjIlWcRCCjpGphm1NWXK6mKKYZCH0AJv7sxwYghpcpdDc7i5EfLxjX32raeP25/866i1ySCJHl7h0VfLTBQr7LevGrI/fpyJoaIgEluknLqTKi9w5u4McghhLmNqCFMT/Xz8U8k9kUC3mpjxlR8ddKuVKgyr2qBFSv5Jj7aPnrShBBW9fkLb0F1iFgPmeMIE0LtRXrekhJDpWgmfClhMaelzY02r12rWUD5Wwdnkp9TTGmnI2rZ6AJZK+Ggi3ZX9KKS6xRwnF6rTMkX+AB5aulaYnYqKSk8e6tgXrl9t5YE6IXHASn0k/XitgsqW2y+0F5mXJVMWUxdGShD1XbK4IWyx1V09X1oUgFWDFgKlkpDx6qfemrXrLoH5r55ju44xx3D78nMjUp/I3jzZtb9++gSyCDCSqIcUgfLFHdVdgq/yHTnv0iIsryrNnC0MYoBjPPUvfnLcvrp9Ahv27L0Ei4Q+++HLU/bh7+6z6Ta5S5KzlWD+nbMwdC0SOoToH4uhaUrRB6iuuDyQsDJULtvNl5ZtotG0Lz1yguE048EB/7eRwX6746pVVsH8PzrQtn3HNOVrHs5luRert1UCoXA9/xky7TnNUC3vs2uI01+8tt+++sQxOxCT8ihQ4PqXjQzZP//KWlvZz6yEbFnpa09N2Z89edxTcmpBIMT31OUSSJZlzEM9EFsZRnrS3Xb1qpJ96YkTdt+uJg/KFg+RecDrc+8fdtBfe2jMtr46bde/o26/e80Ku3V9v23Z3XbjeUTNyXg0nCc6d0VXSFzwQmihgObZnv3sisi2vTqJn9HnfYzj6qDFlX67bk2fPflmw7Y8P2atxpRte+mQ3fVPo/YLADPWaC8GhZkVD53KHGBxEbyDxxrD3kjgZHvHmhqjxF/yrYj+1kJugNTwonpsO8emLerjfu0c0qKajR5vMsoB9bgt5d2VUUDO46Ys8ObO7tU+lrmlMamBrRC651jHPrBWY1iLOp9LbP0wQih7eRb3K5INWTwwZFGlahcOagURnEykwwiREg7t7RZ+JDKyjz9Ni66ohEf293tm7IGPr7bxdsd2nkgtxhF+5yrMSdlzgricDLglrBvZz11asslZQHMTq7tUZGgVgS8tnnPJudTP3r/UUh7V6Mi5Jm3zz68wJhyr4qh1ljDPHZqxF44CUovt/DrLm00127Qqtm88PuYs1aXyZl8WIVegRY8vBE/c87kj0/jkjQIRptXC69H9Dbvp/o594vK6bSBqvXK4YX/z1DgTvjZsYjs81bO7th21XnOS1JYhpw0cuklgwcmQpX7MmS8CVkqrSimm9sxRMRebR6wWtJNz6ETDHnp5xkZILl4/PmuNlO2KfkyOwCxjuuyyDsYiUlbbVtp20nwcHFXMl8U1Ihcaiq6eA65rfYsRdP1F59iX37faLsCTi7LzcMd+74m2vT5Nuwygar5/QpafKe1RMsCfhIQ4zaVILylS0yuJuV94hdguqaf2zRuq1mIt9e2dk/biuNiW7KoL6nbP+6t2+7aWoGjCGGebKdWOnrVgysCKiQ25hcVYkpcWMlTNStx2kyu8SdvMblsb2VvkOnc8MGr7jzXRWiBl+7fXp+y1K1byvM/uf00WEgLdg7mVOIrlQqiir3V3YWEkhT52PD6UQSgurx3M7HvPE6dPEBxIb2JFLoKFth63H2jYh9eQCHik8v07GEqJ4FiF30innNNCTL/G1Ll+OntFhdCeTc1mzMMdSwbOJVwOBI+lSUoau2aoZ6v7JZKpURsrGi8wVsQqekyKaKWo74UPOWL+oRlVllIVKumQ02S2faxlV6wesOeaMCN6yZDqrw+dX7ZPryvZwSmCiGYDFdqFlQE6yNSSo5Osp2u5+ZKS51w8FLjXFjibr6DsIgeISe4IUzSTJYzFXA+luj5RlNgxCm14ygWkUYAzRwHlk4QaLinUUxXxlvNwLXMxlDasDKv+EULWir6MhVlM5EptdKJl57BD5b5AJwYr5UA0VxrvRUS4kPM5RLg79wkVOYQqF41Dww7muf8mZp9FhYzTdJhN90r2/F5Ng5pGuaEuAkljmEfO3MOm5HuLxR+y4eIiIUjSyvE7L07bG1OpdTC7hJ/P4uyGNWV75lATx8OxfD+rECvFuRYoInw3Sazdiosh9O1UYK+T0XuZ/eWPx62pGcJtBTPm6e8wJz/0ycvskf1kmZkiWgHsDec+vOucxNytRRfLdHt4/j02z9jRIp9mwtf41WqCebfKmO5nLHz2Krphuc5bJP70X05lLAI42AwboPGAJviKbRqJ7Z1DkR2c7trJmVl74D+mjBgCY+m9POPTQ4YnpwIjyH8OYivxlrWJ3X210p5CTNm6ab997cdH2U6ctrg2LN88o7IMMHIw4ZUrYwd9fKxt//jKtI0QqVqse/dNtO1OzPz0UdKjhrznjHBP71zXjpg9OTZrn31wv3X5zeEj6wZtppPZTw40bfRkx+7cNGJ372Q+PsOyLGP9eHUZa6R/2D3hw8Kdi22nriYFto8Psw01pOGsMXaGDnYqsIQBPN4gxVU2MzBMxCxbD0+m262v3m+3viNm7cQwox6pxxlxPhXYiWS29fVZ++AldXt6GmfDy2cB+fymfvJqhVezT289BmHfujl7wIo2O8kkzx9SSNRPByV7c7qHR2f28Oisbd41Zc+zPx3zY9mZllMZi472KZkKt+7v2EVsFWocr62V7fsvHrft+8MY1raE9j7OXh/7OEYg20e3XhrZ3e/RXqZ4wdxqsB6xr++YsntfBRMFtW1xJuVUxpKicXxeGdCK+TjeO0V6m9ksuzrKLn/r3SvsmYme7Z7AEc9qAMGzr111mnFMQNnPtuWd7z7X7n7uf3McV9gYb3RskO0m/7H6dOP4bSxxqqnfbhwPZPk4VvL+/+P4v+7fp5o6H8e3bBi0LfvYoWVXT+VNJoZb7hv1H6k/snHYxuoVO56e5XGsROC8WsnuvHLAjrRiz7m6bX4CYmHIL8x28wY2FV/t2mPjWvIxjt/GkZazwyLGah9yJXZhyTL/IN8BCA1VdT5EHuJXt8fG/7vDaaHGuiapK+Pdn3jwLTs8oxgdMSVm7ApkJAiJXTnSZ9/d3YKo1ske1oJuy34uFD5fYRHj+dts+7OXufPAScyoLFO5FQIAP3i4axuHV7MPFtu2cZlZ06KELwbwb2oyL3TRVQ6cPy5qExR2HIMMuzph/SNghLCK1JbDERKBm9fXbdthOn1RUXIvIQVcIbf4Pl9Zmx3hW9HA2bEe0NsS/J7EnoTHbq9EwKj1t+yWjTW6QGxpu9DShXw/F3LnwRZeIZUKCNBfcCwtRSK7fWPZbn9nYnSxMTd4KaPEpfx0u4L0565HDuMKrCSVtkmBQvFc1qJ7cxaYh07cNFT2Jaca5cvUKkwqLLim2wwY7ZZSmmSZzxzq2b+8csK2vjZjUV3pbQ5anHMiCxVZBhd15TzFgTerpJg0YeX10c1kmL2crh5IOHsdsm+JnT2tlcI4DjJ8bpYMl5f3t8jkciWiKMQDVVTA18KbVEfs2DLazBZT13994fvCGUg/hlX6iGj5UKK+ZimfqZAVXrMJ5yA7V6RAzM9JeAFMoY93dbjpLyegpZahkVhpV6gYq2JM/4d3RHA8ByWIaJZycK5ROnwP56AQz5eURG8l+ZaTHhAgNC61XM54YSgsqjWUlrquKoglbASI+XX4G2z+Xhc/YOvMnlewBvWWFID1hgp3i35WnuxDSjUxo28wFK0EmN/3LsKkCKdPANJba/nh1yijt56kkOosKUnWmeUW0tQ/7MyJpczte86qvLB/C1CZXIqqTcFYb64RXPTKXDgXiuTWWAqctvn9CAElXn/S3ofe6RLo4t8E3SShqUClKOdg6tysOXAKkQyZIuRK6N29mcm3luBakrVY6KqP5K0ycw7sTBeynWsZQANw7lTerzItLAFN280A7gq0rH1s7Pm55vlFks5OszZiBabdV4XHOTPD8qcAh8BTOJdYy9QyLwwF3Gr6OZ1ttJovPfpX4C3ysKTHj87+luIC4MA2rJHc8wqnFtnczB5M6OcwXApzAyxwzCzwdGZqZurZrV/oTh/dlQPn/URC0R5/42Xfa5aZAXePhumcc50ylBAhwEIBIpt7Np6bulezi9uYPN45Mvry9N4nf2Cz06/RQuFOri1gL+JyWX59tk4FK0UNzZsaNvx45dcyt4ND0bSNcjaLBAtAwGIqcJ3nQLl2O/I60VktBeMCXAosAhXafwKL4F8G+I8d8wAAAABJRU5ErkJggg==";
        Cobrowse.offline_ad = "Call our customer service department!";
        Cobrowse.online_ad = "";
        if ($("#cobrowser").data("cta")) { cta = $("#cobrowser").data("cta"); }
        if ($("#cobrowser").data("offline")) { Cobrowse.offline_ad = $("#cobrowser").data("offline"); }
        if ($("#cobrowser").data("online")) { Cobrowse.online_ad = $("#cobrowser").data("online"); }
        if ($("#cobrowser").data("debug")) { Cobrowse.debug = true; }
    
        var cta_img = $("<img>").attr("src", cta)
        var cta = $("<a>").attr("href", "#").attr("id", "cobrowse_cta").addClass("cobrowse_show_activate");
        cta_img.appendTo(cta)
        cta.appendTo(cobrowse)
    
        var wrapper = $("<div>").attr("id", "cobrowse_wrapper");
        var prompt = $("<p>").attr("id", "cobrowse_prompt").text(Cobrowse.offline_ad);
        var start = $("<a>").attr("href", "#").attr("id", "cobrowse_start").addClass("green_button").text("Connect")
        var already_have_code = $("<a>").attr("href", "#").attr("id", "cobrowse_already_have").text("Already have an activation code?");
        prompt.appendTo(wrapper);
        start.appendTo(wrapper);
        already_have_code.appendTo(wrapper)
    
        var activation_code_form = $("<form>").attr("id", "cobrowse_activation_code_form");
        var activation_code_form_input = $("<input>").attr("type", "text").attr("id", "cobrowse_activation_code");
        var activation_code_form_submit = $("<input>").attr("type", "submit").addClass("green_button").val("Join")
        activation_code_form_input.appendTo(activation_code_form)
        activation_code_form_submit.appendTo(activation_code_form)
        activation_code_form.appendTo(wrapper)
    
        wrapper.appendTo(cobrowse)
        cobrowse.appendTo("body")
        Cobrowse.log("Cobrowse CTA Created.")
      },
  
      createControlCentre: function() {
        if (!Cobrowse.offline_ad) { Cobrowse.offline_ad = "Call our customer service department!"; }
        if (!Cobrowse.offline_ad) { Cobrowse.online_ad = ""; }
        var cobrowse_control_center = $("<div>").attr("id", "cobrowse_control_center")
        var ac = $("<div>").attr("id", "cobrowse_ac")
        var activation_code_text = $("<input>").attr("id", "cobrowse_activation_code_text").addClass("green_button").attr("readonly", true)
        var activation_code_label = $("<label>").attr("for", "cobrowse_activation_code_text").attr("id", "cobrowse_activation_code_label").text("Session ID: ")
        var online_ad = $("<p>").attr("id", "cobrowse_online_ad").addClass("cobrowse_ad").text(Cobrowse.online_ad)
        var offline_ad = $("<p>").attr("id", "cobrowse_offline_ad").addClass("cobrowse_ad").text(Cobrowse.offline_ad)
        var destroy_session = $("<a>").attr("href", "#").attr("id", "cobrowse_destroy_session").text("Disconnect")
    
        activation_code_label.appendTo(ac)
        activation_code_text.appendTo(ac)
        ac.appendTo(cobrowse_control_center)
        online_ad.appendTo(cobrowse_control_center)
        offline_ad.appendTo(cobrowse_control_center)
        destroy_session.appendTo(cobrowse_control_center)
        cobrowse_control_center.appendTo("body")
        Cobrowse.log("Cobrowse Control Centre Created.")
      },
  
      createArrows: function() {
        var scroll_down = $("<div>").attr("id", "cobrowser_scroll_down")
        var scroll_up = $("<div>").attr("id", "cobrowser_scroll_up")
        scroll_down.appendTo("body")
        scroll_up.appendTo("body")
      },
  
      addStyle: function() {
        var ss = document.createElement("link");
        ss.setAttribute("rel", "stylesheet");
        ss.setAttribute("type", "text/css");
        ss.setAttribute("href", Cobrowse.stylesheet);
        document.getElementsByTagName("head")[0].appendChild(ss);
        Cobrowse.log("Cobrowse style added from " + Cobrowse.stylesheet + ".")
      },
  
      init: function() {
        Cobrowse.api_key = $("#cobrowser").data("api-key");
        
        if (!Cobrowse.stylesheet) {
          if ($("#cobrowser").data("style")) { 
            Cobrowse.stylesheet = $("#cobrowser").data("style"); 
          } else {
            Cobrowse.stylesheet = atob("aHR0cHM6Ly93d3cuZGFsanMub3JnL2NvYnJvd3Nlci5taW4uY3Nz");
          }
        }
        
        if (!Cobrowse.me.id) {
          if ($.cookie("cobrowse_mouse_id")) {
            Cobrowse.me.id = Cobrowse.me.id;
          } else {
            Cobrowse.me.id = Cobrowse.uuid();
            $.cookie("cobrowse_mouse_id", Cobrowse.me.id);
          }
        }
        
        if (btoa(window.location.hostname).replace("=", "") == Cobrowse.api_key) {
          Cobrowse.addStyle();
          Cobrowse.createCta();
          Cobrowse.createControlCentre();
          Cobrowse.createArrows();
    
          if (!!$.cookie("cobrowse_channel")) {
            $("#cobrowse").hide();
            Cobrowse.activate($.cookie("cobrowse_channel"))
          } else {
            $("#cobrowse_control_center").hide();
          }
          
          Cobrowse.log("Cobrowse Initiated.")
        } else {
          Cobrowse.log("Cobrowse Initiated, but not shown due to API Key/Domain constraints.")
        }
      },
  
      connect: function() {
				var end_point = atob("aHR0cHM6Ly93d3cuZGFsanMub3JnOjkyOTEvZmF5ZQ==");
				//var end_point = atob("aHR0cDovL2xvY2FsaG9zdDo5MDAwL2ZheWU=");
        Cobrowse.faye = new Faye.Client(end_point);
        
        if ("faye is connected" == "faye is connected") {
					Cobrowse.log("Cobrowsed Connected.")
          Cobrowse.connected = true;
          $.cookie("cobrowse_channel", Cobrowse.activation_code);
          $("#cobrowse_offline_ad").show();

          if (!$.cookie("cobrowse_dont_sent_next_page_change")) {
            if ($("#cobrowse").attr("data-remote") != "true" && !$("#cobrowser").attr("data-url") && $("#cobrowser").attr("data-url") != document.URL) {
              var url = document.URL;
              var html = $("html").clone()
              html.find("#cobrowser, #cobrowse, #cobrowse_control_center").remove()
              $("#cobrowser").attr("data-url", url);
              Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "page_change", id: Cobrowse.me.id, url: url, html: html.find("body").html() });
            }
          } else {
            $.removeCookie("cobrowse_dont_sent_next_page_change")
          }
    
          Cobrowse.faye.subscribe(Cobrowse.channel + "/event", function(m) {
						Cobrowse.log("Cobrowse " + m.event + ".")
            if (Cobrowse.me.id != m.id) {
              if (m.event == "mousemove") {
                if (!$("#remote-pointer-" + m.id).length) {
                  var pointer = $("<div>").addClass("remote-pointer").attr("id", "remote-pointer-" + m.id);
                  $("#cobrowse_online_ad").show()
                  $("#cobrowse_offline_ad").hide()
                  pointer.appendTo("body");
                } else {
                  var scrolled = $(document).scrollTop();

                  $("#remote-pointer-" + m.id).css({
                    left: m.x,
                    top: m.y
                  });
    
                  if (m.y > Cobrowse.me.height + scrolled) {
                    $("#cobrowser_scroll_down").show();
                    $("#cobrowser_scroll_up").hide();
                  } else if (m.y + 10 < scrolled) {
                    $("#cobrowser_scroll_up").show();
                    $("#cobrowser_scroll_down").hide();
                  } else {
                    $("#cobrowser_scroll_up, #cobrowser_scroll_down").hide();
                  }

                  $("#cobrowse_offline_ad").hide()
                  $("#cobrowse_online_ad").show()
                }
              } else if (m.event == "page_change") {
                $.cookie("cobrowse_dont_sent_next_page_change", m.url);
                //Cobrowse.disconnect();
                $("body").html(m.html)
                Cobrowse.createCta();
                Cobrowse.createControlCentre();
                Cobrowse.createArrows();
                $("#cobrowse").hide();
                $("#cobrowse_control_center").show();
                $("#cobrowse_activation_code_text").val(Cobrowse.activation_code);
                Cobrowse.page_is_remote = true;
								//Cobrowse.connect();
                //console.log($(m.html).find("body"))
                //var c = Cobrowse;
                // var newDoc = document.open("text/html", "replace");
                // newDoc.write(m.html);
                // newDoc.close();
                //Cobrowse = c;
                //c = null;
                // Cobrowse.activate(Cobrowse.activation_code);
              } else if (m.event == "resize") {
                if (m.mouse.width > Cobrowse.me.width) {
                  $("body").css("width", Cobrowse.me.width)
                } else {
                  $("body").css("width", m.mouse.width)
                }
              } else if (m.event == "click") {
                if ($("#remote-pointer-" + m.id).length) {
                  $("#remote-pointer-" + m.id).addClass("click");
                  setTimeout(function(){
                    $("#remote-pointer-" + m.id).removeClass("click");
                  }, 500);
                }
              } else if (m.event == "field") {
                // if ($("#remote-pointer-" + m.id).length) {
                //   $(m.path).val(m.value);
                // }
              } else if (m.event == "disconnect") {
                $("#remote-pointer-" + m.id).remove();
              }
            }
          });
    
          Cobrowse.updateMouse();
        }
      },
  
      updateMouse: function() {
        if (Cobrowse.connected) {
          Cobrowse.me.event = "mousemove";
          Cobrowse.faye.publish(Cobrowse.channel + "/event", Cobrowse.me);
          setTimeout(Cobrowse.updateMouse, Cobrowse.updateInterval);
        }
      },
  
      activate: function(code) {
        Cobrowse.activation_code = code.toUpperCase();
        Cobrowse.channel = "/v1-" + Cobrowse.api_key + "/" + Cobrowse.activation_code;
        Cobrowse.connect();
        
        $("#cobrowse_activation_code_text").val(Cobrowse.activation_code);
        $("#cobrowse").hide()
        $("#cobrowse_control_center").show()
        Cobrowse.log("Cobrowse Activated.")
      },
  
      deactivate: function() {
        $(".remote-pointer").remove()
        $("#cobrowse_activation_code").val("")
        $("#cobrowse_control_center, #cobrowse_wrapper").hide()
        $("#cobrowse").show()
        $.removeCookie("cobrowse_channel");
        Cobrowse.disconnect()
        Cobrowse.log("Cobrowse Deactivated.")
      },
  
      disconnect: function() {
				Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "disconnect", id: Cobrowse.me.id });
        Cobrowse.faye.disconnect()
        Cobrowse.connected = false;
        Cobrowse.log("Cobrowse Disconnected.")
      },
  
      uuid: function(short) {
        if (short == true) {
          var min = 1000;
          var max = 10000;
          var num = Math.floor(Math.random() * (max - min + 1)) + min;
          return num.toString();
        } else {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
              return v.toString(16);
          });
        }
      }
    }
    
    Cobrowse.init();

    $(document).on("click", ".cobrowse_show_activate", function() {
      $("#cobrowse_wrapper").toggle();
      return false;
    });

    $(document).on("click", "#cobrowse_start", function() {
      Cobrowse.activate(Cobrowse.uuid(true).toUpperCase());
      return false;
    });

    $(document).on("click", "#cobrowse_already_have", function() {
      $("#cobrowse_activation_code_form").show()
      $("#cobrowse_activation_code").focus()
      return false;
    });

    $(document).on("submit", "#cobrowse_activation_code_form", function() {
      var code = $("#cobrowse_activation_code").val()
      Cobrowse.activate(code);
      return false;
    });

    $(document).on("click", "#cobrowse_destroy_session", function() {
      Cobrowse.deactivate();
      return false;
    });

    $(document).on("mousemove", "html, body", function(e) {
      if (Cobrowse.connected) {
        Cobrowse.me.x = e.pageX || e.clientX;
        Cobrowse.me.y = e.pageY || e.clientY;
      }
    });
    
    $(document).on("click", "*:not(#cobrowse_destroy_session)", function() {
      if (Cobrowse.page_is_remote) {
        alert("You are not allowed to click due to security retrictions.")
        return false;
      }
    });

    $(window).resize(function() {
      if (Cobrowse.connected) {
        Cobrowse.me.width = $(window).width();
        Cobrowse.me.height = $(window).height();
        Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "resize", id: Cobrowse.me.id, mouse: Cobrowse.me });
      }
    });

    $(document).on("click", "*", function(e) {
      if (Cobrowse.connected) {
        Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "click", id: Cobrowse.me.id, target: $(e.target).getPath() });
      }
    });
   
  }(jQuery));
  
}