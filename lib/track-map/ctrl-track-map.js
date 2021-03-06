angular.module("trialsTrackmap")
    .controller("trackMap", function (improveTimes, categories, urlHandler, trackData, $useLocalFiles,
                                      $rootScope, $scope, $filter) {
        urlHandler.setParams(["world"]);
        $rootScope.selectedWorld = parseInt(urlHandler.get("world")) || 2;
        trackData.setWorld($rootScope.selectedWorld);
        $rootScope.otherWorld = trackData.getOtherWorld();
        $scope.worldImage = null;
        $scope.worldAlt = null;
        
        function setWorldData() {
            var activeWorld = $scope.data.images.trackmaps[$rootScope.selectedWorld];
            $scope.worldImage = $filter("hoster")(activeWorld[$useLocalFiles ? "lSrc" : "src"], $scope.data.hoster);
            $scope.worldAlt = activeWorld.alt;
        }
        
        $scope.changeWorld = function (newWorld) {
            $rootScope.selectedWorld = parseInt(newWorld);
            urlHandler.set({world: $rootScope.selectedWorld});
            trackData.setWorld($rootScope.selectedWorld);
            $scope.trackmapReady = false;
            $rootScope.$emit("world:changed", newWorld);
        };
        
        $scope.repeatObject = function (object) {
            return object ? Object.keys(object) : [];
        };
        
        $scope.handleSidebars = function (event, which, action, forceClose) {
            function handleBar(_which_, _forceClose_) {
                var sidebar = angular.element(document.querySelector(".new-sidebar." + _which_));
                // open
                if (!_forceClose_ && !sidebar.hasClass("open")) {
                    // check if opposite is open
                    if (action && action.indexOf("toggle") >= 0) {
                        if (handleBar(action.replace("toggle", "").toLowerCase(), true)) {
                            return false;
                        }
                    }
                    sidebar.addClass("open");
                    return false;
                    // close if isnt closed
                } else if (sidebar.hasClass("open")) {
                    sidebar.removeClass("open");
                    return true;
                }
            }
            
            if (which === "close") {
                handleBar("left", true);
                handleBar("right", true);
                return false;
            } else if (forceClose) {
                handleBar(which, true);
                return false;
            } else {
                if (event && event.hasOwnProperty("stopPropagation")) {
                    event.stopPropagation();
                }
                handleBar(which);
            }
        };
        
        $scope.visibility = function (variable) {
            $scope[variable] = $scope[variable] ? false : true;
        };
        
        $scope.searchTrack = "";
        $scope.clearSearch = function () {
            $scope.searchTrack = "";
        };
        
        $rootScope.$on("handleSidebars", function ($evt, event, which, action, forceClose) {
            $scope.handleSidebars(event, which, action, forceClose);
        });
        
        $rootScope.$on("data:loaded", function () {
            $scope.tracksInTiers = trackData.getTracksInTiers();
            $scope.tracksInTiersNum = trackData.getData("listedTracks");
            $scope.tracksInOtherWorld = trackData.getData("otherWorldTracks");
            
            $scope.$watch("searchTrack", function (data) {
                $scope.tracksInTiers = trackData.getTracksInTiers(data);
                $scope.tracksInTiersNum = trackData.getData("listedTracks");
                $scope.tracksInOtherWorld = trackData.getData("otherWorldTracks");
            });
            
            setWorldData();
        });
        
        $rootScope.$on("filter:tracks", function (event, filterCatId) {
            categories.setFilterCatId(filterCatId);
            $scope.tracksInTiers = trackData.getTracksInTiers(null);
            $scope.tracksInTiersNum = trackData.getData("listedTracks");
            $scope.tracksInOtherWorld = trackData.getData("otherWorldTracks");
        });
        
        $rootScope.$on("world:changed", function (event, newWorld) {
            setWorldData(newWorld);
            $scope.tracksInTiers = trackData.getTracksInTiers(null);
            $scope.tracksInTiersNum = trackData.getData("listedTracks");
            $rootScope.otherWorld = trackData.getOtherWorld();
            $scope.tracksInOtherWorld = trackData.getData("otherWorldTracks");
        });
    })