
// Based on:
// http://vanderlee.github.io/limitslider/
// https://github.com/vanderlee/limitslider/blob/master/jquery.limitslider.js
// http://stackoverflow.com/questions/4731709/jquery-ui-slider-range-with-3-handles-and-configurable-colors
// http://jsfiddle.net/AV3G3/3/
// http://stackoverflow.com/questions/17629524/jquery-ui-slider-limit-the-range
// http://jsfiddle.net/alnitak/zFYjW/4/

var colorBreakPoint4Default = 0.40;    //above or equal to this value: bright red
var colorBreakPoint3Default = 0.20;    //above or equal to this value and below colorBreakPoint1: dark red
var colorBreakPoint2Default = -0.20;   //above or equal to this value and below colorBreakPoint2: black
var colorBreakPoint1Default = -0.40;   //above or equal to this value and below colorBreakPoint3: green
                                //below colorBreakPoint4: bright green

var sliderMin = -1;
var sliderMax = 1;
var sliderStep = 0.05;

// Reset color slider values back to defaults
function resetColorSlider() {
    $("#custom-handle1").text( colorBreakPoint1Default );
    $("#custom-handle2").text( colorBreakPoint2Default );
    $("#custom-handle3").text( colorBreakPoint3Default );
    $("#custom-handle4").text( colorBreakPoint4Default );

    colorBreakPoint1 = colorBreakPoint1Default;
    colorBreakPoint2 = colorBreakPoint2Default;
    colorBreakPoint3 = colorBreakPoint3Default;
    colorBreakPoint4 = colorBreakPoint4Default;

    $("#colorSlider").slider( "option", "values", [colorBreakPoint1Default, colorBreakPoint2Default, colorBreakPoint3Default, colorBreakPoint4Default]);

    calcRangeColors();
}

// Calculate the colored parts of the slider
function calcRangeColors() {

    var leftOffsets = [0, $("#custom-handle1").position().left, $("#custom-handle2").position().left, $("#custom-handle3").position().left, $("#custom-handle4").position().left];
    var rightOffsets = [$("#custom-handle1").position().left, $("#custom-handle2").position().left, $("#custom-handle3").position().left, $("#custom-handle4").position().left, $("#colorSlider").width()];  

    $('.ui-slider-range', $("#colorSlider")).remove();

    for (index = 0; index <= $("#colorSlider").slider("values").length; index++) {

        sliderRange = $('<div></div>').addClass('ui-slider-range');
        sliderRange.css('width', rightOffsets[index] - leftOffsets[index]);

        if(!$('#monochromeCheckbox').is(':checked')) {
            sliderRange.addClass(colors[index]);
        }
        else {
            sliderRange.addClass(monochromeColors[index]);
        }

        sliderRange.css('left', leftOffsets[index]);

        $("#colorSlider").prepend(sliderRange);
    }
}

// Stop a slide event if it breaks the ranges
function mySlide(event, ui) {

    newVal1 = ui.values[0];
    newVal2 = ui.values[1];
    newVal3 = ui.values[2];
    newVal4 = ui.values[3];

    if (!(newVal1 < colorBreakPoint2 && newVal1 < colorBreakPoint3  && newVal1 < colorBreakPoint4)) {
        return false;
    }
    if (!(newVal2 > colorBreakPoint1 && newVal2 < colorBreakPoint3  && newVal2 < colorBreakPoint4)) {
        return false;
    }
    if (!(newVal3 > colorBreakPoint1 && newVal3 > colorBreakPoint2  && newVal3 < colorBreakPoint4)) {
        return false;
    }
    if (!(newVal4 > colorBreakPoint1 && newVal4 > colorBreakPoint2  && newVal4 > colorBreakPoint3)) {
        return false;
    }
    return true;
}

// Update the handles, color ranges, and real breakpoints when changed
function myChange(event, ui) {

    $("#custom-handle1").text(ui.values[0]);
    $("#custom-handle2").text(ui.values[1]);
    $("#custom-handle3").text(ui.values[2]);
    $("#custom-handle4").text(ui.values[3]);

    $("#custom-handle1").attr("aria-valuenow", ui.values[0]);
    $("#custom-handle2").attr("aria-valuenow", ui.values[1]);
    $("#custom-handle3").attr("aria-valuenow", ui.values[2]);
    $("#custom-handle4").attr("aria-valuenow", ui.values[3]);

    calcRangeColors();

    // Change the real breakpoints used in our application
    colorBreakPoint4 = ui.values[3];
    colorBreakPoint3 = ui.values[2];
    colorBreakPoint2 = ui.values[1]; 
    colorBreakPoint1 = ui.values[0];

    refreshTables();
}


$( function() {

    $( "#colorSlider" ).slider({
        min: sliderMin,
        max: sliderMax,
        values: [ colorBreakPoint1Default, colorBreakPoint2Default, colorBreakPoint3Default, colorBreakPoint4Default ],
        step: sliderStep,
        slide: mySlide,
        change: myChange
    });

    resetColorSlider();
} );