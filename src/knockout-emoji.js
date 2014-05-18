(function(){
    if (!ko){
        throw new Error('KnockoutJS isn\'t defined');
    }

    if (!window.$){
        throw new Error('JQuery isn\'t defined');
    }

    var forcePath = null,
        proceedInText = false,
        emojiList = ##emoji-list;

    function setupBindings(config){
        if (!config){
            throw new Error('Empty config for ko.bindingHandlers.emoji is\'t allowed');
        }

        if (config.path){
            if (typeof config.path !== 'string'){
                throw new Error('Config. Path for ko.bindingHandlers.emoji should be a string');
            }

            forcePath = config.path;
        }

        if (config.css){
            if (typeof config.css !== 'string'){
                throw new Error('Config. CSS Path for ko.bindingHandlers.emoji should be a string');
            }

            var head = document.head || document.getElementsByTagName('head')[0],
                fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", config.css);
            head.appendChild(fileref);
        }

        proceedInText = !!config.searchInText;
    }

    function emojiHandler (element, valueAccessor){
        var classes = element.className.split(' '),
            newClasses = [],
            attrValue = typeof valueAccessor == 'function'? valueAccessor() : valueAccessor,
            regexp = /em-/,
            path;

        for(var i = 0; i < classes.length; i++){
            var _class = classes[i];
            if (!regexp.test(_class)){
                newClasses.push(_class);
            }
        }
        newClasses.push('em-' + attrValue.toString());
        element.className = newClasses.join(' ');

        if (forcePath){
            path = 'background-image:url('+forcePath+');';
            if (element.setAttribute){
                element.setAttribute('style', path);
            } else {
                element.style.setAttribute('cssText', path);
            }
        }
    }

    ko.bindingHandlers.emoji = {
        update: emojiHandler, 
        config: setupBindings
    }

    ko.bindingHandlers.emojis = {
        update: function(element, valueAccessor){
            var isEnabled = typeof valueAccessor == 'function'? valueAccessor() : valueAccessor,
                elements, text, result, iconName;

            if (isEnabled){
                if (proceedInText){
                    setTimeout(function(){
                        elements = $(element).find('*');

                        var regex = /:(.*?):/gi,
                            stopRegex = /\b/g;

                        for (var i = 0; i < elements.length; i ++){
                            text = $(elements[i]).html();
                            while ( ( result = regex.exec(text) ) != null ){
                                iconName = result[0].replace(/:/g, '');
                                if (stopRegex.test(iconName)){
                                    continue;
                                }
                                text = text.replace(result[0], '<span emoji="' + iconName + '"></span>');
                            }

                            $(elements[i]).html(text);
                        }
                    }, 0);
                }
                setTimeout(function(){
                    elements = $(element).find('*[emoji]');
                    $.each(elements, function(index, element){
                        emojiHandler(element, $(element).attr('emoji'));
                    });
                }, 0);
            } else {
                //TODO: find all emoji elements and make them mockup
            }
        },
        config: setupBindings
    }
})();