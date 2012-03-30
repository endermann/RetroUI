(function ($) {
    var retroOptions;
    var programManagerDiv;

    var methods = {
        init: function (options) {
            return this.each(function () {
                initPlugin(this, options);
            });
        },
        createProgramGroup: function (groupName) {
            return this.each(function () {
                createProgramGroup(groupName);
            });
        },
        addProgram: function (groupName, filename, callback) {
            return this.each(function () {
                addProgram(groupName, filename, callback);
            });
        }
    };

    $.fn.retroWindows = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.retro');
        }
    };

    function initPlugin(target, options) {
        programManagerDiv = $(target);

        var defaults = {
            width: 640,
            height: 480
        };

        retroOptions = $.extend(defaults, options);

        $(programManagerDiv).addClass("retroWindowsContainer");
        $(programManagerDiv).css('width', retroOptions.width + "px");
        $(programManagerDiv).css('height', retroOptions.height + "px");
        $(programManagerDiv).css('position', 'relative');
        $(programManagerDiv).append(buildHeaderDiv('Program Manager'));
    }

    function buildHeaderDiv(title) {
        var titleDiv = $('<div style="background-color:#000080; border-bottom:2px solid grey; width:100%; height:18px;text-align:center;color:white;font-weight:bold;font-family:Arial">' + title + '</div>');
        var closeDiv = $('<div class="close" style="float:left;"/>');
        closeDiv.append($('<img src="/img/close.png" />'));
        var maxMinDiv = $('<div style="float:right;"/>');
        maxMinDiv.append($('<img src="/img/maxmin.png" />'));
        titleDiv.append(closeDiv);
        titleDiv.append(maxMinDiv);

        var menuDiv = $('<div style="background-color:white;width:100%; height:18px; font-weight:bold; border-bottom:1px solid grey;"><span style="text-decoration:underline">F</span>ile&nbsp;&nbsp;&nbsp;&nbsp;<span style="text-decoration:underline">O</span>ptions&nbsp;&nbsp;&nbsp;&nbsp;<span style="text-decoration:underline">W</span>indow&nbsp;&nbsp;&nbsp;&nbsp;<span style="text-decoration:underline">H</span>elp</div>');

        var headerDiv = $('<div />');
        headerDiv.append(titleDiv);
        headerDiv.append(menuDiv);
        return headerDiv;
    }

    function createProgramGroup(groupName) {
        if (doesGroupExist(groupName)) {
            $.error('Program group "' + groupName + '" already exists.');
        }
        var programGroupIcon = buildIconDiv(groupName, '/img/programGroup.png', 'groupIcon');
        programGroupIcon.bind({ dblclick: function () { $('#group' + cleanName(groupName)).show(); } });

        var programGroupHtml = '<div id="group' + cleanName(groupName) + '" style="display:none; background-color:white; position:absolute; top:40px; border:2px solid grey; width:' + (retroOptions.width - 40) + 'px; height:' + (retroOptions.height - 60) + 'px;" />';
        var programGroup = $(programGroupHtml);
        programGroup.prepend(buildHeaderDiv(groupName));
        $(programGroup).find(".close").bind({ dblclick: function () { $(programGroup).hide(); } });


        programManagerDiv.append(programGroupIcon);
        programManagerDiv.prepend(programGroup);
    }

    function addProgram(groupName, filename, callback) {
        if (!doesGroupExist(groupName)) {
            $.error('Program group "' + groupName + '" does not exist.<br/>');
            return;
        }

        var programIcon = buildIconDiv(filename, '/img/fileManager.png', 'programIcon');
        programIcon.bind({ dblclick: function () { callback(); } });
        
        $('#group' + cleanName(groupName)).append(programIcon);
    }

    function buildIconDiv(iconName, iconImage, idPrefix) {
        var iconDiv = $('<div id="' + idPrefix + cleanName(iconName) + '" style="float:left; padding:20px; text-align:center; width:80px;" />');
        iconDiv.append("<img src='" + iconImage + "'/></br><span class='iconText'>" + iconName + "</span>");
        iconDiv.bind({
            click: function() {
                $(".iconText").removeClass('retroWindowsIconSelected');
                $(iconDiv).find(".iconText").addClass('retroWindowsIconSelected');
            }
        });
        return iconDiv;
    }

    function doesGroupExist(groupName) {
        return $("#groupIcon" + cleanName(groupName)).length > 0;
    }

    function cleanName(name) {
        return name.replace(/\./gi, "").replace(/ /gi, "");
    }

})(jQuery);

