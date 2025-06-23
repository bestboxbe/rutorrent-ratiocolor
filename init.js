/***
Ratiocolors!
Change the color of the ratio column according to the ratio
Originally written by Gyran
Enhanced and further developed by BestBox
***/

plugin.loadLang();
plugin.loadMainCSS();


if (plugin.ratioColorSettings === undefined) {
    plugin.ratioColorSettings = {
        levels: [0, 1, 3, 5, 10, 30, 50],
        colors: [
            [255, 0, 0],
            [255, 155, 50],
            [0, 220, 0],
            [0, 200, 100],
            [0, 180, 180],
            [0, 155, 255],
            [100, 100, 255]
        ],
        changeWhat: "cell-background",
        contrast: true
    };
}


const important = "!important;";


function colorSub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];  
}

function colorAdd(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];  
}

function colorMul(a, mul) {
    return [Math.floor(a[0] * mul), Math.floor(a[1] * mul), Math.floor(a[2] * mul)];  
}

function colorRGB(color) {
    return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";    
}

function colorContrast(color) {
    const gamma = color[0]*0.299 + color[1]*0.587 + color[2]*0.114;
    const c = (color[1]>160) ? 0 : ((gamma < 155) ? 255 : 0);
    return "rgb(" + c + ", " + c + ", " + c + ")";   
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [255, 255, 255];
}


function rgbToHex(rgb) {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}


plugin.saveSettings = function() {
    const req = new XMLHttpRequest();
    req.open("POST", "plugins/ratiocolor/action.php?action=setratiocolor", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = function() {
        if(req.readyState == 4) {
            if(req.status == 200) {
                theWebUI.setRatioColors();
            } else {
                log("Error saving ratiocolor settings: " + req.status);
            }
        }
    };
    req.send(JSON.stringify(plugin.ratioColorSettings));
};


theWebUI.setRatioColors = function() {
    const settings = plugin.ratioColorSettings;
    
    $(".stable-List-col-6").each(function(index) {
        const ratio = $(this).children("div")[0].innerHTML;
        let color = null;
        let proc = 0;
        
        $.each(settings.levels, function(index, level) {
            if(ratio < level) {
                const leveldiff = level - settings.levels[index - 1];
                proc = (ratio - settings.levels[index - 1]) / leveldiff;
                
                const diffColor = colorSub(settings.colors[index], settings.colors[index - 1]);
                color = colorAdd(colorMul(diffColor, proc), settings.colors[index - 1]);
                
                return false;           
            }
        });
       
        if(color === null) {
            color = settings.colors[settings.colors.length - 1];
        }
        
        switch(settings.changeWhat) {
            case "font":
                $(this).css("color", colorRGB(color));  
                break;
            case "cell-background":
            default:
                if (settings.contrast)
                    $(this).css("color", colorContrast(color));
                $(this).attr('style', function(i, s) { 
                    return s.replace(/background-color:(.*?);/, '') + 'background-color:' + colorRGB(color) + important 
                });
                $(this).css("background-image", "none");
                break;
        }
    });
};

plugin.onLangLoaded = function() {
    plugin.enabled = true;
    if(plugin.enabled) {
        let error = false;
        

        if(plugin.ratioColorSettings.colors.length != plugin.ratioColorSettings.levels.length) {
            log(theUILang.ratiocolorLengthError);
            error = true;
        }
        if(plugin.ratioColorSettings.levels[0] != 0) {
            log(theUILang.ratiocolorLevel0);
            error = true;
        }
        
        if(!error) {
            plugin.tempFunc = theWebUI.tables.trt.obj.refreshRows;
            theWebUI.tables.trt.obj.refreshRows = function(height, fromScroll) {
                plugin.tempFunc.call(theWebUI.tables.trt.obj, height, fromScroll);
                theWebUI.setRatioColors();
            };
            
    
            const rcSettingsDiv = $('<div>').attr("id","st_ratiocolor");
            const fieldset = $('<fieldset>').html("<legend>" + theUILang.ratiocolorLegend + "</legend>");
            

            const modeDiv = $('<div>').addClass("op100l");
            modeDiv.html(theUILang.ratiocolorMode + ': <select id="ratiocolor_mode"></select>');
            const modeSelect = modeDiv.find('#ratiocolor_mode');
            modeSelect.append('<option value="cell-background">' + theUILang.ratiocolorBackground + '</option>');
            modeSelect.append('<option value="font">' + theUILang.ratiocolorFont + '</option>');
            modeSelect.val(plugin.ratioColorSettings.changeWhat);
            modeSelect.change(function() {
                plugin.ratioColorSettings.changeWhat = $(this).val();
                plugin.saveSettings();
            });
            fieldset.append(modeDiv);
            

            const contrastDiv = $('<div>').addClass("op100l");
            const contrastCheck = $('<input type="checkbox" id="ratiocolor_contrast">');
            contrastCheck.prop('checked', plugin.ratioColorSettings.contrast);
            contrastCheck.change(function() {
                plugin.ratioColorSettings.contrast = $(this).is(':checked');
                plugin.saveSettings();
            });
            contrastDiv.append(contrastCheck).append('<label for="ratiocolor_contrast">' + theUILang.ratiocolorContrast + '</label>');
            fieldset.append(contrastDiv);
            

            fieldset.append(theWebUI.ratiocolorLevelsbar(plugin.ratioColorSettings.levels, plugin.ratioColorSettings.colors));
            

            const divAdd = $('<div>').attr("id", "ratiocolorAddNewLevel").addClass("op100l");
            divAdd.html(theUILang.ratiocolorLevel + ': <input id="rcAddLvl" type="text" size="5" />&nbsp;&nbsp;' + 
                        theUILang.ratiocolorColor + ': <input id="rcAddColor" type="color" />');
            const btnAdd = $('<input>').attr({
                type: "button",
                value: theUILang.ratiocolorAddLevel,
                class: "Button"
            });
            btnAdd.click(function() {
                const levelVal = $("#rcAddLvl").val();
                const color = $("#rcAddColor").val();
                
                if (!levelVal || isNaN(parseFloat(levelVal))) {
                    return;
                }
                
                const level = parseFloat(levelVal);
                const rgb = hexToRgb(color);
                
                plugin.ratioColorSettings.levels.push(level);
                plugin.ratioColorSettings.colors.push(rgb);
                

                const combined = [];
                for (let i = 0; i < plugin.ratioColorSettings.levels.length; i++) {
                    combined.push({
                        level: plugin.ratioColorSettings.levels[i],
                        color: plugin.ratioColorSettings.colors[i]
                    });
                }
                combined.sort(function(a, b) {
                    return a.level - b.level;
                });
                
                plugin.ratioColorSettings.levels = combined.map(function(item) { return item.level; });
                plugin.ratioColorSettings.colors = combined.map(function(item) { return item.color; });
                

                theWebUI.updateRatiocolorsLevelsBar(plugin.ratioColorSettings.levels, plugin.ratioColorSettings.colors);
                plugin.saveSettings();
            });
            divAdd.append(btnAdd);
            fieldset.append(divAdd);
            
            rcSettingsDiv.append(fieldset);
            plugin.attachPageToOptions(rcSettingsDiv[0], theUILang.ratiocolorSettings);
        }
    }
};

theWebUI.ratiocolorLevelsbar = function(levels, colors) {
    const div = $("<div>").attr("id","ratiocolorLevelsbar");
    const width = Math.floor(100/(colors.length-1)) + "%";
    
    for(let i=1; i<colors.length; ++i) {
        const level = $("<div>").addClass("level");
        
        
        const levelText = $("<span>").text(levels[i]);
        level.append(levelText);
        

        if (i > 1 || colors.length > 2) {
            const deleteBtn = $("<span>").addClass("delete-level").html("&times;");
            deleteBtn.attr("title", theUILang.ratiocolorDeleteLevel);
            
            (function(currentIndex) {
                deleteBtn.click(function() {
                    if (plugin.ratioColorSettings.levels.length <= 2) {
                        return;
                    }
                    
                    plugin.ratioColorSettings.levels.splice(currentIndex, 1);
                    plugin.ratioColorSettings.colors.splice(currentIndex, 1);
                    
                    theWebUI.updateRatiocolorsLevelsBar(plugin.ratioColorSettings.levels, plugin.ratioColorSettings.colors);
                    plugin.saveSettings();
                });
            })(i);
            
            level.append(deleteBtn);
        }
        
        level.css({
            "background": "linear-gradient(to right, " + colorRGB(colors[i-1]) + ", " + colorRGB(colors[i]) + ")",
            "width": width
        });
        div.append(level[0]);
    }
    return div;
};

theWebUI.updateRatiocolorsLevelsBar = function(levels, colors) {

    const oldBar = $('#ratiocolorLevelsbar');
    const newBar = theWebUI.ratiocolorLevelsbar(levels, colors);
    oldBar.replaceWith(newBar);
};

plugin.onRemove = function() {
    this.removePageFromOptions("st_ratiocolor");
};
