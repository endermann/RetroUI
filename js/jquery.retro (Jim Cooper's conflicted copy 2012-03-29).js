(function ($) {
    var retroOptions;
    var contentDiv;
    var promptSpan;
    var pathSpan;
    var commandInput;
    var paths = [];
    var currentPath = "";
    var executables = [];

    var methods = {
        init: function (options) {
            return this.each(function () {
                initPlugin(this, options);
            });
        },
        mkdir: function (path) {
            return this.each(function () {
                mkdir(path);
            });
        },
        addExecutable: function (path, filename, date, time, callback) {
            return this.each(function () {
                addExecutable(path, filename, date, time, callback);
            });
        }
    };

    $.fn.retroConsole = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.retro');
        }
    };

    function initPlugin(target, options) {

        var defaults = {
            contentContainerId: 'retroConsoleContent',
            inputId: 'retroConsoleInput',
            prompt: 'C:\\',
            commandCallback: function () { }
        };
        retroOptions = $.extend(defaults, options);

        $(target).addClass("retroConsoleContainer");
        contentDiv = $('<div/>', { id: 'retroConsoleContent' });
        $(target).append(contentDiv);

        promptSpan = $('<span/>', { id: 'inputSpan' });
        pathSpan = $('<span/>', { id: 'pathSpan' });
        promptSpan.append(retroOptions.prompt);
        promptSpan.append(pathSpan);
        promptSpan.append(">");

        commandInput = $('<input/>', { id: 'retroConsoleInput' });
        $(target).append(promptSpan);
        $(target).append(commandInput);

        $(target).bind({ click: function () { $(commandInput).focus(); } });
        $(contentDiv).bind({ click: function () { $(commandInput).focus(); } });

        $(commandInput).keypress(handleKeypress);
    }

    function mkdir(path) {
        if (doesPathExist(path)) {
            $.error('Directory "' + path + '" already exists.');
        }
        paths = paths.concat(path);
    }

    function addExecutable(path, filename, date, time, callback) {
        if (!doesPathExist(path)) {
            $.error('Directory "' + path + '" does not exists.');
            return;
        }
        executables = executables.concat({ path: path, filename: filename, date: date, time: time, callback: callback });
    }

    function doesPathExist(path) {
        return ($.inArray(path, paths) != -1);
    }

    function handleKeypress(event) {
        if (event.keyCode == 13) {
            var command = commandInput.val();
            handleCommand(command);
            retroOptions.commandCallback(command);
            $('#' + retroOptions.inputId).val('');
            return;
        }
    }

    function handleCommand(command) {
        contentDiv.append(retroOptions.prompt + ">" + command + "<br/>");
        var commandParts = command.split(' ');
        if (commandParts[0] == "cd") {
            if (commandParts.length != 2) {
                contentDiv.append("Usage: cd [path]");
                return;
            }
            changeDirectory(commandParts[1]);
        } else if (commandParts[0] == "dir") {
            var table = $("<table/>");
            for (var j = 0; j < paths.length; j++) {
                if (paths[j].indexOf(currentPath) == 0 && paths[j].length > currentPath.length) {
                    var dirsRow = $('<tr/>');
                    $(dirsRow).append('<td style="width:100px;">08/12/1981</td>');
                    $(dirsRow).append('<td style="width:100px;">00:00:00</td>');
                    $(dirsRow).append('<td style="width:100px;">&lt;DIR&gt;</td>');
                    $(dirsRow).append('<td style="width:100px;">' + paths[j] + '</td>');
                    $(table).append(dirsRow);
                }
            }
            for (var k = 0; k < executables.length; k++) {
                if (executables[k].path == currentPath) {
                    if (paths[k].indexOf(currentPath) == 0) {
                        var executablesRow = $("<tr/>");
                        $(executablesRow).append('<td style="width:100px;">' + executables[k].date + '</td>');
                        $(executablesRow).append('<td style="width:100px;">' + executables[k].time + '</td>');
                        $(executablesRow).append('<td style="width:100px;"></td>');
                        $(executablesRow).append('<td style="width:100px;">' + executables[k].filename + '</td>');
                        $(table).append(executablesRow);
                    }
                }
                $(contentDiv).append(table);
            }
        } else {
            for (var i = 0; i < executables.length; i++) {
                if (executables[i].path == currentPath && executables[i].filename == commandParts[0]) {
                    executables[i].callback();
                }
            }
        }
    }

    function changeDirectory(path) {
        if (currentPath == "" && doesPathExist(path)) {
            currentPath = path;
        } else if (doesPathExist(currentPath + "\\" + path)) {
            currentPath = currentPath + "\\" + path;
        } else if (doesPathExist(path) && path.substr(0, 1) == '\\') {
            currentPath = path;
        } else {
            contentDiv.append('Directory "' + path + '" does not exist.');
        }
        pathSpan.html(currentPath);
    }
})(jQuery);

