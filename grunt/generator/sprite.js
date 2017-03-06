module.exports = function () {
    return {
        generateSprites: function () {
            var globalVars = {},
                paintJobsJSON = require("../../database/media/paintjobs.json"),
                gfxJSON = require("../../database/media/gfx.json"),
                bikeNamesJSON = require("../../database/bikes.json"),
                paintJobsRAW = paintJobsJSON.bikes,
                //gfx dimensions
                spritePaintJobIconDimensions = "1100x1400".split("x"),
                spritePaintJobDimensions = "980x550".split("x"),
                //sprite dimensions
                paintJobDimensions = "70x50".split("x"),
                paintJobIconDimensons = "100x100".split("x"),
                //scale dimensions
                spritePaintJobScalePercent = 90,
                spritePaintJobIconScalePercent = 50;
            
            function trimName(name) {
                var name = "" + name.toLowerCase()
                        .replace(/ /g, "-")
                        .replace(/\(/g, "")
                        .replace(/\)/g, "");
                return name;
            }
            
            function calcPercantage(pixel, scalePercent) {
                var factor = scalePercent / 100;
                return pixel * factor;
            }
            
            // paintjobs
            globalVars._spritePaintJobsDimensionWidth = calcPercantage(spritePaintJobDimensions[0], spritePaintJobScalePercent);
            globalVars._spritePaintJobsDimensionHeight = calcPercantage(spritePaintJobDimensions[1], spritePaintJobScalePercent);
            globalVars._paintJobWidth = calcPercantage(paintJobDimensions[0], spritePaintJobScalePercent);
            globalVars._paintJobHeight = calcPercantage(paintJobDimensions[1], spritePaintJobScalePercent);
            globalVars._paintJobSelectors = [];
            globalVars._paintJobNames = [];
            globalVars._paintJobPositions = [];
            // paintjob icons
            globalVars._spritePaintJobsIconDimensionWidth = calcPercantage(spritePaintJobIconDimensions[0], spritePaintJobIconScalePercent);
            globalVars._spritePaintJobsIconDimensionHeight = calcPercantage(spritePaintJobIconDimensions[1], spritePaintJobIconScalePercent);
            globalVars._paintJobIconWidth = calcPercantage(paintJobIconDimensons[0], spritePaintJobIconScalePercent);
            globalVars._paintJobIconHeight = calcPercantage(paintJobIconDimensons[1], spritePaintJobIconScalePercent);
            globalVars._paintJobIconNames = [];
            globalVars._paintJobIconSelectors = [];
            globalVars._paintJobIconPositions = [];
            // gfx
            globalVars._gfxPaintjobs = gfxJSON.images.paintjobs.src.replace("#1/", "");
            globalVars._gfxPaintjobIcons = gfxJSON.images["paintjob-icons"].src.replace("#1/", "");
            
            for (var bikeID in paintJobsRAW) {
                
                if (!(bikeID in bikeNamesJSON)) {
                    console.error("The bikeID: " + bikeID + " isnt in bikeNamesJSON");
                    return;
                }
                
                var bikeName = trimName(bikeNamesJSON[bikeID].name),
                    bikeIndex = Object.keys(paintJobsRAW).indexOf(bikeID);
                
                for (var paintJob in paintJobsRAW[bikeID]) {
                    var paintJobName = trimName(paintJobsRAW[bikeID][paintJob].name),
                        paintJobIndex = Object.keys(paintJobsRAW[bikeID]).indexOf(paintJob);
                    // paintjobs
                    globalVars._paintJobNames.push("paintjob-" + bikeName + "-" + paintJobName);
                    globalVars._paintJobSelectors.push("paintjob-" + bikeID + "-" + paintJobIndex);
                    
                    var left = (globalVars._paintJobWidth * bikeIndex),
                        top = (globalVars._paintJobHeight * paintJobIndex);
                    
                    globalVars._paintJobPositions.push((left > 0 ? "-" : "") + left + (left !== 0 ? "px" : "") + " " + (top > 0 ? "-" : "") + top + (top !== 0 ? "px" : ""));
                    // icons
                    globalVars._paintJobIconNames.push("paintjob-icon-" + bikeName + "-" + paintJobName);
                    globalVars._paintJobIconSelectors.push("paintjob-icon-" + bikeID + "-" + paintJobIndex);
                    
                    var left = (globalVars._paintJobIconWidth * paintJobIndex),
                        top = (globalVars._paintJobIconHeight * bikeIndex);
                    
                    globalVars._paintJobIconPositions.push((left > 0 ? "-" : "") + left + (left !== 0 ? "px" : "") + " " + (top > 0 ? "-" : "") + top + (top !== 0 ? "px" : ""));
                }
            }
            
            return globalVars;
        }
    }
};