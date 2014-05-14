ymaps.ready(init);
var myMap;

var placemarks = [[], [], [], []]

function init() {
    myMap = new ymaps.Map("map", {
        center: [41.20, 74.00],
        zoom: 6,
        type: 'yandex#hybrid'
    });
    myMap.behaviors.enable('scrollZoom');
    myMap.controls.add('zoomControl', {
        float: 'none',
        position: {
            right: 40,
            top: 5
        }
    });

    loadGeoData();

    putPlacemarksOnMap();

    var buttons = [];
    buttons[0] = new ymaps.control.Button('Пресные');
	buttons[1] = new ymaps.control.Button('Минеральные');
	buttons[2] = new ymaps.control.Button('Термальные');
	buttons[3] = new ymaps.control.Button('Термальные минеральные');


    var typeControls = new ymaps.control.Group({
        items: buttons
    }, {
        position: { left: 40 }
    });

    buttons[0].events.add(['select'], function (e) {
        showGroup(0);
    });
    buttons[0].events.add(['deselect'], function (e) {
        hideGroup(0);
    });
    buttons[1].events.add(['select'], function (e) {
        showGroup(1);
    });
    buttons[1].events.add(['deselect'], function (e) {
        hideGroup(1);
    });
    buttons[2].events.add(['select'], function (e) {
        showGroup(2);
    });
    buttons[2].events.add(['deselect'], function (e) {
        hideGroup(2);
    });
    buttons[3].events.add(['select'], function (e) {
        showGroup(3);
    });
    buttons[3].events.add(['deselect'], function (e) {
        hideGroup(3);
    });


    myMap.controls.add(typeControls);
}

function showGroup(index) {
    myMap.setCenter([41.20, 74.00], 6, { duration: 1000 });
    for (var i = 0; i < placemarks[index].length; i++) {
        placemarks[index][i].options.set({ visible: true });
    }
}

function hideGroup(index) {
    for (var i = 0; i < placemarks[index].length; i++) {
        placemarks[index][i].options.set({ visible: false });
    }
}

function loadGeoData() {
    var pureCsv = $.ajax({ type: "GET",
        url: "data.csv",
        async: false
    }).responseText;

    var commaSeparatedLines = pureCsv.split('\n');

    for (var i = 2; i < commaSeparatedLines.length; i++) {
        var line = commaSeparatedLines[i].split(';');

        if (parseInt(line[5]) == 4 && parseInt(line[6]) == 41) {
            placemarks[getTypeIndex(line[7])].push(createPlacemark(line))
        }
    }
}

function createPlacemark(line) {
    var size = parseInt(line[16]) * 10 + 10;
    
    var placemark = new ymaps.Placemark([line[19], line[18]], {
        hintContent: line[3],
        balloonContentHeader: line[3] + "(" + line[4] + ")",
        balloonContent: line[36]
    }, {
        iconLayout: 'default#image',
        iconImageHref: getIcon(line[7]),
        iconImageSize: [size, size],
        iconImageOffset: [-size/2, -size/2],
        visible: false
    });

    return placemark;
}

function getTypeIndex(stringIndex) {
    switch (stringIndex) {
        case '411': return 0;
        case '412': return 1;
        case '414': return 2;
        case '415': return 3;
    }
}

function getIcon(stringIndex) {
    switch (stringIndex) {
        case '411': return 'pure.png';
        case '412': return 'mineral.png';
        case '414': return 'thermal.png';
        case '415': return 'thermalMineral.png';
    }
}

function putPlacemarksOnMap() {
    for (var i = 0; i < placemarks.length; i++) {
        for (var j = 0; j < placemarks[i].length; j++) {
            myMap.geoObjects.add(placemarks[i][j]);
        }        
    }
};
