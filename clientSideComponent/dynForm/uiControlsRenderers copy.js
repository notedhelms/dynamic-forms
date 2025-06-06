
corticon.util.namespace("corticon.dynForm");

corticon.dynForm.UIControlsRenderer = function () {

    let itsFlagRenderWithKui = false;

    function renderUI(containers, baseEl, labelPositionAtUILevel, language, useKui) {
        itsFlagRenderWithKui = useKui;

        baseEl.empty();

        if (itsFlagRenderWithKui) {
            baseEl.addClass('k-content');
        }
        else {
            baseEl.addClass('dynUIContainerColors');
        }

        for (let i = 0; i < containers.length; i++)
            renderUIForOneContainer(containers[i], baseEl, labelPositionAtUILevel, language);

        const allFormEls = $(baseEl).find(':input');
        if (allFormEls !== null && allFormEls.length > 0)
            allFormEls[0].focus();
    }

    function renderUIForOneContainer(container, baseEl, labelPositionAtUILevel, language) {
        let html = '<div';
        if (itsFlagRenderWithKui)
            html += ' class="k-content"';

        html += ' id="' + container.id + '"  title="' + container.title + '"><h3>' + container.title + '</h3></div>';
        baseEl.append(html);

        const uiControls = container.uiControls;
        if (uiControls === undefined || uiControls === null) {
            alert('There are no UI Controls to render in this step');
            return;
        }

        for (var i = 0; i < uiControls.length; i++) {
            const oneUIControl = uiControls[i];
            if (oneUIControl.type === 'Text')
                renderTextInput(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'TextArea')
                renderTextAreaInput(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'DateTime')
                renderDateTimeInput(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'YesNo' || oneUIControl.type === 'YesNoBoolean')
                renderYesNoInput(oneUIControl, baseEl, labelPositionAtUILevel, language, oneUIControl.type);
            else if (oneUIControl.type === 'ReadOnlyText')
                renderReadOnlyText(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'Number')
                renderNumberInput(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'SingleChoice')
                renderSingleChoiceInput(oneUIControl, baseEl);
            else if (oneUIControl.type === 'MultipleChoices' || oneUIControl.type === 'MultipleChoicesMultiSelect')
                renderMultipleChoicesInput(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'MultiExpenses')
                renderExpenseInput(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'FileUpload')
                renderFileUploadInput(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'FileUploadExpenses')
                renderFileUploadExpenseInput(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'QRCode')
                renderQRCode(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'GeoCoordinates')
                renderGeoCoordinates(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'Rating')
                renderRating(oneUIControl, baseEl, labelPositionAtUILevel);
            else if (oneUIControl.type === 'MultiText') {
                renderMultiTextInput(oneUIControl, baseEl, labelPositionAtUILevel);
            }
            else
                alert('This ui control is not yet supported: ' + oneUIControl.type);
        }

        renderContainerValidationMessage(container.validationMsg, baseEl);
    }

    let nextExpenseId = 0;
    function renderExpenseInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
        const html = '<div class="expenseInputContainer"></div>';
        const expenseContainerEl = $(html);
        baseEl.append(expenseContainerEl);

        appendLabel(oneUIControl, labelPositionAtContainerLevel, expenseContainerEl);

        createOneExpenseInput(oneUIControl, expenseContainerEl);

        createAddExpenseControl(baseEl, oneUIControl, expenseContainerEl);

        addValidationMsgFromDecisionService(oneUIControl, expenseContainerEl);
    }

    function createAddExpenseControl(baseEl, oneUIControl, expenseContainerEl) {
        const html = '<div title="Add another expense" class="addExpenseContainer">&nbsp;+&nbsp;</div>';
        const addContainerEl = $(html);
        baseEl.append(addContainerEl);
        addContainerEl.click(function () {
            createOneExpenseInput(oneUIControl, expenseContainerEl);
        });
    }

    function createOneExpenseInput(oneUIControl, expenseContainerEl) {
        nextExpenseId++;
        const inputContainerEl = createInputContainer(expenseContainerEl, true, true);
        inputContainerEl.data("uicontroltype", oneUIControl.type);
        let htmlExpenseType = `<select "id": ${oneUIControl.id}_expType_${nextExpenseId}>`;
        const theOptions = oneUIControl.option;
        if (theOptions === undefined || theOptions === null) {
            alert("Missing options for " + oneUIControl.id);
        }
        else {
            if (theOptions.length > 0) {
                for (let i = 0; i < theOptions.length; i++)
                    htmlExpenseType += `<option value="${theOptions[i].value}">${theOptions[i].displayName}</option>`;
            }
            else
                alert('missing list of options for expense control ' + oneUIControl.id);
        }


        const expenseEl = $(htmlExpenseType);
        expenseEl.data("uicontroltype", oneUIControl.type);

        inputContainerEl.append(expenseEl);

        const theAttributes = { "type": "number", "id": `${oneUIControl.id}_expAmount_${nextExpenseId}` };
        const textInputEl = $('<input class="expenseAmount"/>').attr(theAttributes);
        textInputEl.data("uicontroltype", oneUIControl.type);

        textInputEl.appendTo(inputContainerEl);
        if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null) {
            textInputEl.data("fieldName", oneUIControl.fieldName);
            textInputEl.data("type", "array");
        }
        else
            alert('Missing field name for ' + oneUIControl.id);
        let currency = `<select class="currencySelector" "id": ${oneUIControl.id}_Currency_${nextExpenseId}>`;
        currency += `<option value="USD">$ US Dollars</option>`;
        currency += `<option value="EUR">&euro; Euro</option>`;
        currency += '</select>';
        const currencyEl = $(currency);

        function addCurrencyDropDown(oneUIControl, inputContainerEl) {
            let currency = `<select class="currencySelector" "id": ${oneUIControl.id}_Currency_${nextExpenseId}>`;
            currency += `<option value="USD">$ US Dollars</option>`;
            currency += `<option value="EUR">&euro; Euro</option>`;
            currency += '</select>';

            const currencyEl = $(currency);
            currencyEl.data("fieldName", oneUIControl.fieldName);
            inputContainerEl.append(currencyEl);
        }
        currencyEl.data("uicontroltype", oneUIControl.type);
        currencyEl.data("fieldName", oneUIControl.fieldName);
        inputContainerEl.append(currencyEl);
    }



    let nextTextId = 0;
    function renderMultiTextInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
        const html = '<div class="multiTextInputContainer"></div>';
        const multiTextContainerEl = $(html);
        baseEl.append(multiTextContainerEl);
        multiTextContainerEl.data("uicontroltype", oneUIControl.type);
        appendLabel(oneUIControl, labelPositionAtContainerLevel, multiTextContainerEl);

        createOneMultiTextInput(oneUIControl, multiTextContainerEl);

        createAddMultiTextControl(baseEl, oneUIControl, multiTextContainerEl);

        addValidationMsgFromDecisionService(oneUIControl, multiTextContainerEl);
    }

    function createAddMultiTextControl(baseEl, oneUIControl, multiTextContainerEl) {
        const addContainerEl = createPlusButton(baseEl);
        addContainerEl.click(function () {
            createOneMultiTextInput(oneUIControl, multiTextContainerEl);
        });
    }

    function createOneMultiTextInput(oneUIControl, multiTextContainerEl) {
        nextTextId++;
        const inputContainerEl = createInputContainer(multiTextContainerEl, true, true);
        inputContainerEl.data("uicontroltype", oneUIControl.type);

        const theAttributes = { "type": "text", "id": `${oneUIControl.id}_text_${nextTextId}` };
        const textInputEl = $('<input/>').attr(theAttributes);
        textInputEl.appendTo(inputContainerEl);

        if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null) {
            textInputEl.data("fieldName", oneUIControl.fieldName);
            textInputEl.data("type", "array");
        } else {
            alert('Missing field name for ' + oneUIControl.id);
        }
    }
    function renderSingleChoiceInput(oneUIControl, baseEl) {
        const inputContainerEl = createInputContainer(baseEl);

        if (oneUIControl.label !== undefined && oneUIControl.label !== null) {
            const theAttributes = { "type": "checkbox", "id": oneUIControl.id, "name": oneUIControl.id };
            const checkboxInputEl = $('<input/>').attr(theAttributes);
            checkboxInputEl.appendTo(inputContainerEl);
            const checkboxLabelEl = $(`<label for="${oneUIControl.id}">&nbsp;${oneUIControl.label}</label>`)
            checkboxLabelEl.appendTo(inputContainerEl);
            if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null)
                checkboxInputEl.data("fieldName", oneUIControl.fieldName);
            else
                alert('Missing field name for ' + oneUIControl.id);

            if (itsFlagRenderWithKui)
                checkboxInputEl.kendoCheckBox();
        }
        else
            alert('Missing label for checkbox ' + oneUIControl.id);
    }

    function renderFileUploadInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
        const inputContainerEl = createInputContainer(baseEl);

        if (oneUIControl.id === undefined || oneUIControl.id === null) {
            alert('missing id for fileupload ');
            return;
        }

        if (oneUIControl.label === undefined || oneUIControl.label === null || oneUIControl.label.length === 0) {
            alert('missing label for fileupload ' + oneUIControl.id);
            return;
        }
        const fileUpHtml = `<label htmlFor="${oneUIControl.id}">${oneUIControl.label}:</label>
								<input type="file" id="${oneUIControl.id}">`;
        const fileUpEl = $(fileUpHtml);
        inputContainerEl.append(fileUpEl);
        if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null)
            fileUpEl.data("fieldName", oneUIControl.fieldName);
        else
            alert('Missing field name for ' + oneUIControl.id);

        if (itsFlagRenderWithKui)
            fileUpEl.kendoUpload();
    }

    function renderFileUploadExpenseInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
        const inputContainerEl = createInputContainer(baseEl);

        if (oneUIControl.id === undefined || oneUIControl.id === null) {
            alert('missing id for fileupload ');
            return;
        }

        if (oneUIControl.label === undefined || oneUIControl.label === null || oneUIControl.label.length === 0) {
            alert('missing label for fileupload ' + oneUIControl.id);
            return;
        }
        const fileUpHtml = `<label htmlFor="${oneUIControl.id}">${oneUIControl.label}:</label>
								<input class="markerFileUploadExpense" type="file" id="${oneUIControl.id}">`;
        const fileUpEl = $(fileUpHtml);
        inputContainerEl.append(fileUpEl);
        if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null)
            fileUpEl.data("fieldName", oneUIControl.fieldName);
        else
            alert('Missing field name for ' + oneUIControl.id);
    }

    function renderQRCode(oneUIControl, baseEl, labelPositionAtUILevel) {
        if (!itsFlagRenderWithKui) {
            alert("QRCode UI controls can only be rendered in KendoUI mode");
            return;
        }

        if (oneUIControl.value === undefined || oneUIControl.value === null) {
            console.log('Error rendering QRCode no value specified - id: ' + oneUIControl.id);
            return;
        }

        const contEl = $(`<div class="inputContainer"></div>`);
        contEl.appendTo(baseEl);

        appendLabel(oneUIControl, labelPositionAtUILevel, contEl);

        const qrCodeEl = $(`<div class="QRCode" id="${oneUIControl.id}"></div>`);
        qrCodeEl.appendTo(contEl);

        if (itsFlagRenderWithKui)
            qrCodeEl.kendoQRCode({ value: oneUIControl.value });
        else
            qrCodeEl.html = oneUIControl.value;
    }

    function renderTextInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
        renderInputThatSupportsArrayType(oneUIControl, baseEl, labelPositionAtContainerLevel);
    }

    function createOneTextInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl, addBreak = false) {
        const theAttributes = { "type": "text", "id": oneUIControl.id + getNextUniqueId() };
        if (oneUIControl.tooltip !== undefined && oneUIControl.tooltip !== null)
            theAttributes["title"] = oneUIControl.tooltip;

        const textInputEl = $('<input/>').attr(theAttributes);
        textInputEl.appendTo(inputContainerEl);
        if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null)
            textInputEl.data("fieldName", oneUIControl.fieldName);
        else
            alert('Missing field name for ' + oneUIControl.id);

        if (oneUIControl.value !== undefined && oneUIControl.value !== null) {
            textInputEl.val(oneUIControl.value);
        }

        if (addBreak) {
            const breakEl = $('<div>');
            breakEl.append(textInputEl);
            inputContainerEl.append(breakEl);
        }
        else {
            inputContainerEl.append(textInputEl);
        }

        if (itsFlagRenderWithKui)
            textInputEl.kendoTextBox();
    }

    function renderTextAreaInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
        const inputContainerEl = createInputContainer(baseEl);

        appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);

        let html3 = `<textarea class="textAreaControl" id="${oneUIControl.id}"`;
        if (oneUIControl.rows !== undefined && oneUIControl.rows !== null)
            html3 += ` rows="${oneUIControl.rows}"`;

        if (oneUIControl.cols !== undefined && oneUIControl.cols !== null)
            html3 += ` cols="${oneUIControl.cols}"`;

        if (oneUIControl.min !== undefined && oneUIControl.min !== null)
            html3 += ` minlength="${oneUIControl.min}"`;

        if (oneUIControl.max !== undefined && oneUIControl.max !== null)
            html3 += ` maxlength="${oneUIControl.max}"`;

        html3 += `></textarea>`;

        const textInputEl = $(html3);
        textInputEl.appendTo(inputContainerEl);
        if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null)
            textInputEl.data("fieldName", oneUIControl.fieldName);
        else
            alert('Missing field name for ' + oneUIControl.id);

        if (itsFlagRenderWithKui)
            textInputEl.kendoTextArea();

        addValidationMsgFromDecisionService(oneUIControl, inputContainerEl);
    }

    function createOneDateTimeInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl, addBreak = false) {
        let controlType;
        let tag;
        if (oneUIControl.showTime !== undefined && oneUIControl.showTime !== null && oneUIControl.showTime) {
            controlType = 'datetime-local';
            tag = "datetimetag";
        }
        else {
            controlType = 'date';
            tag = "datetag";
        }

        const theAttributes = { "type": controlType, "id": oneUIControl.id + getNextUniqueId() };
        if (oneUIControl.minDT !== undefined && oneUIControl.minDT !== null)
            theAttributes['min'] = oneUIControl.minDT;

        if (oneUIControl.maxDT !== undefined && oneUIControl.maxDT !== null)
            theAttributes['max'] = oneUIControl.maxDT;

        if (oneUIControl.value !== undefined && oneUIControl.value !== null) {
            const localDate = new Date(Number(oneUIControl.value));

            let month = (localDate.getMonth() + 1);
            let day = localDate.getDate();
            if (month < 10)
                month = "0" + month;
            if (day < 10)
                day = "0" + day;

            theAttributes['value'] = localDate.getFullYear() + '-' + month + '-' + day;

            if (tag === "datetimetag") {
                let hours = localDate.getHours();
                if (hours < 10)
                    hours = "0" + hours;

                let mn = localDate.getMinutes();
                if (mn < 10)
                    mn = "0" + mn;

                theAttributes['value'] += " " + hours + ":" + mn;
            }
        }

        const textInputEl = $('<input/>').attr(theAttributes);
        textInputEl.data("type", tag);

        textInputEl.appendTo(inputContainerEl);

        if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null)
            textInputEl.data("fieldName", oneUIControl.fieldName);
        else
            alert('Missing field name for ' + oneUIControl.id);

        if (addBreak) {
            const breakEl = $('<div>');
            breakEl.append(textInputEl);
            inputContainerEl.append(breakEl);
        }
        else {
            inputContainerEl.append(textInputEl);
        }

        if (itsFlagRenderWithKui) {
            if (oneUIControl.showTime !== undefined && oneUIControl.showTime !== null && oneUIControl.showTime)
                textInputEl.kendoDateTimePicker({ ...theAttributes, format: 'u' });
            else
                textInputEl.kendoDatePicker({ ...theAttributes, format: 'yyyy-MM-dd' });
        }

        if (oneUIControl.minDT !== undefined && oneUIControl.minDT !== null && oneUIControl.maxDT !== undefined && oneUIControl.maxDT !== null) {
            const html3 = '<span  class="fieldValidationLabel">Enter a date between ' + oneUIControl.minDT.substr(0, 10) + ' and ' + oneUIControl.maxDT.substr(0, 10) + '</span>';
            const validationEl = $(html3);
            inputContainerEl.append(validationEl);
        }
        else if (oneUIControl.minDT !== undefined && oneUIControl.minDT !== null) {
            const html3 = '<span  class="fieldValidationLabel">Enter a date greater than ' + oneUIControl.minDT.substr(0, 10) + '</span>';
            const validationEl = $(html3);
            inputContainerEl.append(validationEl);
        }
        else if (oneUIControl.maxDT !== undefined && oneUIControl.maxDT !== null) {
            const html3 = '<span  class="fieldValidationLabel">Enter a date less than ' + oneUIControl.maxDT.substr(0, 10) + '</span>';
            const validationEl = $(html3);
            inputContainerEl.append(validationEl);
        }
    }

    function createAddTextInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel) {
        const addContainerEl = createPlusButton(baseEl);
        addContainerEl.click(function () {
            createOneTextInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl, true);
        });
    }

    function createAddNumberInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel) {
        const addContainerEl = createPlusButton(baseEl);
        addContainerEl.click(function () {
            createOneNumberInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl, true);
        });
    }

    function createAddDateTimeInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel) {
        const addContainerEl = createPlusButton(baseEl);
        addContainerEl.click(function () {
            createOneDateTimeInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl, true);
        });
    }

    function createPlusButton(baseEl) {
        const html = '<div title="Add another one" class="addTextContainer">&nbsp;+&nbsp;</div>';
        const addContainerEl = $(html);
        baseEl.append(addContainerEl);
        return addContainerEl;
    }

    function renderDateTimeInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
        renderInputThatSupportsArrayType(oneUIControl, baseEl, labelPositionAtContainerLevel);
    }

    function renderInputThatSupportsArrayType(oneUIControl, baseEl, labelPositionAtContainerLevel) {
        const arrayTypeControl = isArrayType(oneUIControl);
        const inputContainerEl = createInputContainer(baseEl, arrayTypeControl, false);
        inputContainerEl.data("uicontroltype", oneUIControl.type);
        appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);

        if (oneUIControl.type === 'Text') {
            createOneTextInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);
            if (arrayTypeControl)
                createAddTextInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel)
        }
        else if (oneUIControl.type === 'Number') {
            createOneNumberInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);
            if (arrayTypeControl)
                createAddNumberInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel)
        }
        else if (oneUIControl.type === 'DateTime') {
            createOneDateTimeInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);
            if (arrayTypeControl)
                createAddDateTimeInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel)
        }
        else {
            alert('Unsupported ui control type as an array type controls ' + oneUIControl.type);
            return;
        }

        addValidationMsgFromDecisionService(oneUIControl, inputContainerEl);
    }

    function createOneNumberInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl, addBreak = false) {
        const html3 = '<span style="display: none;" class="fieldValidationLabel">Enter a number between ' + oneUIControl.min + ' and ' + oneUIControl.max + '</span>';
        const validationEl = $(html3);

        const theAttributes = { "type": "text", "id": oneUIControl.id + getNextUniqueId() };
        const textInputEl = $('<input/>').attr(theAttributes);
        textInputEl.appendTo(inputContainerEl);
        if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null) {
            textInputEl.data("fieldName", oneUIControl.fieldName);
            textInputEl.data("type", "decimal");
        }
        else
            alert('Missing field name for ' + oneUIControl.id);

        if (oneUIControl.value !== undefined && oneUIControl.value !== null) {
            textInputEl.val(oneUIControl.value);
        }

        textInputEl.on("input", function () {
            const input = $(this).val();
            const converted = Number(input);
            if (isNaN(converted))
                alert("Please enter a number");
            else {
                if (converted < oneUIControl.min || converted > oneUIControl.max)
                    validationEl.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            }
        });

        if (oneUIControl.min !== undefined)
            validationEl.show();

        if (addBreak) {
            const breakEl = $('<div>');
            breakEl.append(textInputEl);
            inputContainerEl.append(breakEl);
        }
        else {
            inputContainerEl.append(textInputEl);
        }

        if (itsFlagRenderWithKui) {
            textInputEl.kendoNumericTextBox({
                min: oneUIControl.min,
                max: oneUIControl.max,
                required: true,
                value: typeof oneUIControl.value === 'number' ? oneUIControl.value : undefined
            });
        }
    }

    function renderNumberInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
        renderInputThatSupportsArrayType(oneUIControl, baseEl, labelPositionAtContainerLevel);
    }

    function renderReadOnlyText(oneUIControl, baseEl, labelPositionAtContainerLevel) {
        const inputContainerEl = createInputContainer(baseEl);

        appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);

        if (oneUIControl.value !== undefined && oneUIControl.value !== null && oneUIControl.value.length !== 0) {
            const html3 = '<div class="readOnlyText">' + oneUIControl.value + '</div>';
            inputContainerEl.append($(html3));
        }
        else
            alert("missing value attribute for renderReadOnlyText id: " + oneUIControl.id);
    }

    function renderYesNoInput(oneUIControl, baseEl, labelPositionAtContainerLevel, language, type) {
        const inputContainerEl = createInputContainer(baseEl);

        let yes = 'Yes'; let no = 'No';
        if (language !== undefined && language !== null) {
            if (language.toLowerCase() === 'italian') {
                yes = 'Si';
            }
        }

        appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);

        let yesValue; let noValue;
        if (type === 'YesNo') {
            yesValue = 'yes';
            noValue = 'no';
        }
        else if (type === 'YesNoBoolean') {
            yesValue = 'T';
            noValue = 'F';
        }

        const html3 = `<select "id": ${oneUIControl.id}>
                        <option value="${yesValue}">${yes}</option>
                        <option value="${noValue}">${no}</option>
                </select>`;
        const yesNoEl = $(html3);

        if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null)
            yesNoEl.data("fieldName", oneUIControl.fieldName);
        else
            alert('Missing field name for ' + oneUIControl.id);

        inputContainerEl.append(yesNoEl);

        if (itsFlagRenderWithKui)
            yesNoEl.kendoDropDownList();
    }

    function renderMultipleChoicesInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
        const inputContainerEl = createInputContainer(baseEl);

        appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);

        let html3 = `<select "id": ${oneUIControl.id}`;
        if (oneUIControl.type === 'MultipleChoicesMultiSelect')
            html3 += ' multiple';

        html3 += '></select>';
        const multipleChoicesEl = $(html3);
        inputContainerEl.append(multipleChoicesEl);

        if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null)
            multipleChoicesEl.data("fieldName", oneUIControl.fieldName);
        else
            alert('Missing field name for ' + oneUIControl.id);

        const theOptions = oneUIControl.option;
        const dataSource = oneUIControl.dataSource;
        const weDontHaveOptions = theOptions === undefined || theOptions === null;
        const weDontHaveDataSource = dataSource === undefined || dataSource === null;
        if (weDontHaveOptions && weDontHaveDataSource) {
            alert("Missing datasource or options for " + oneUIControl.id + " - you need to specify at least one of the 2");
        }
        else {
            if (itsFlagRenderWithKui) {
                addOptions(theOptions, dataSource, multipleChoicesEl,
                    inputContainerEl, oneUIControl, () => { multipleChoicesEl.kendoDropDownList(); });
            }
            else
                addOptions(theOptions, dataSource, multipleChoicesEl, inputContainerEl, oneUIControl);
        }

        addValidationMsgFromDecisionService(oneUIControl, inputContainerEl);
    }

    function addOptions(theOptions, dataSource, multipleChoicesEl, inputContainerEl, oneUIControl, completionFct) {
        if (theOptions !== undefined && theOptions !== null) {
            if (theOptions.length > 0) {
                for (var i = 0; i < theOptions.length; i++) {
                    multipleChoicesEl.append($('<option>', {
                        value: theOptions[i].value,
                        text: theOptions[i].displayName
                    }));
                }
                if (itsFlagRenderWithKui && completionFct !== undefined)
                    completionFct();
            } else
                alert('List of options is empty - are you sure you this is intentional? - for multiple choices control  ' + oneUIControl.id);
        }

        if (dataSource !== undefined && dataSource !== null) {
            inputContainerEl.hide();
            const jqxhr = $.get(dataSource, function (data) {
                addOptionsFromDataSource(multipleChoicesEl, data, oneUIControl);
                if (itsFlagRenderWithKui && completionFct !== undefined)
                    completionFct();
                inputContainerEl.show();
            }, "json")
                .done(function () {
                    console.log("success getting list of options on " + dataSource);
                })
                .fail(function (jqXHR, exception) {
                    let msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Not connected. Verify Network.';
                    } else if (jqXHR.status === 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status === 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else {
                        msg = 'Unknown Error.\n' + jqXHR.responseText;
                    }
                    console.log("Could not get error getting list of options from " + dataSource + " - " + msg);
                    console.log(`Got Http Status: ${jqXHR.status} and exception: ${exception}`);
                })
        }
    }

    function addOptionsFromDataSource(multipleChoicesEl, data, oneUIControl) {
        let dataValueField = "value";
        let dataTextField = "displayName";
        let optionsArray = data;
        let sortData = true;
        let sortDir = 'a';

        if (oneUIControl.dataSourceOptions !== undefined && oneUIControl.dataSourceOptions !== null) {
            const dsOptions = oneUIControl.dataSourceOptions[0];
            if (dsOptions.dataValueField !== undefined && dsOptions.dataValueField !== null && dsOptions.dataValueField !== "")
                dataValueField = dsOptions.dataValueField;

            if (dsOptions.dataTextField !== undefined && dsOptions.dataTextField !== null && dsOptions.dataTextField !== "")
                dataTextField = dsOptions.dataTextField;

            if (dsOptions.pathToOptionsArray !== undefined && dsOptions.pathToOptionsArray !== null) {
                optionsArray = data[dsOptions.pathToOptionsArray];
            }

            if (dsOptions.pathToOptionsArray !== undefined && dsOptions.pathToOptionsArray !== null) {
                const result = JSONPath.JSONPath(dsOptions.pathToOptionsArray, data);
                if (result.length === 0)
                    alert("There are no results with the JSON Path expression " + dsOptions.pathToOptionsArray);

                optionsArray = result;
            }
        }

        if (sortData) {
            optionsArray = optionsArray.sort(function (e1, e2) {
                const a = e1[dataTextField];
                const b = e2[dataTextField];
                if (a === b) {
                    return 0;
                } else if (a === null || a === undefined) {
                    return 1;
                } else if (b === null || b === undefined) {
                    return -1;
                } else {
                    if (sortDir === 'a')
                        return a < b ? -1 : 1;
                    else
                        return a < b ? 1 : -1;
                }
            });
        }

        for (let i = 0; i < optionsArray.length; i++) {
            multipleChoicesEl.append($('<option>', {
                value: optionsArray[i][dataValueField],
                text: optionsArray[i][dataTextField]
            }));
        }
    }

    function renderContainerValidationMessage(validationMessage, baseEl) {
        if (validationMessage !== undefined && validationMessage !== null) {
            const html = `<div class="containerValidationMessage">${validationMessage}</div>`;
            const msgEl = $(html);
            baseEl.append(msgEl);
        }
    }

    function createInputContainer(baseEl, arrayTypeControl = false, complexArrayType = false) {
        let html;
        if (arrayTypeControl) {
            let markerClass;
            if (complexArrayType)
                markerClass = 'complexArrayTypeControl';
            else
                markerClass = 'simpleArrayTypeControl';

            html = `<div class="${markerClass} inputContainer"></div>`;
        }
        else
            html = '<div class="nonarrayTypeControl inputContainer"></div>';

        const inputContainerEl = $(html);
        baseEl.append(inputContainerEl);
        return inputContainerEl;
    }

    function addValidationMsgFromDecisionService(oneUIControl, inputContainerEl) {
        if (oneUIControl.validationErrorMsg !== undefined && oneUIControl.validationErrorMsg !== null) {
            const decisionServiceSideValidationEl = $(`<span class="controlValidationMessage">${oneUIControl.validationErrorMsg}</span>`);
            decisionServiceSideValidationEl.appendTo(inputContainerEl);
        }
    }

    function getLabelPositionForControl(oneUIControl, labelPositionAtContainerLevel) {
        let labelPosition;
        if (oneUIControl.labelPosition !== undefined && oneUIControl.labelPosition !== null)
            labelPosition = oneUIControl.labelPosition;
        else
            labelPosition = labelPositionAtContainerLevel;

        return labelPosition;
    }

    function appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl) {
        if (oneUIControl.label !== undefined && oneUIControl.label !== null) {
            let html2;
            const labelPosition = getLabelPositionForControl(oneUIControl, labelPositionAtContainerLevel);
            if (labelPosition === 'Above') {
                html2 = '<div class="inputLabelAbove">' + oneUIControl.label + '</div>';
            } else {
                html2 = '<span class="inputLabelSide">' + oneUIControl.label + '</span>';

            }

            if (oneUIControl.emphasize === true) {
                html2 = $(html2).css({
                    'font-weight': 'bold',
                    'color': 'red'
                });
            } else {
                html2 = $(html2);
            }

            inputContainerEl.append(html2);
        }
    }
    function isArrayType(oneUIControl) {
        if (oneUIControl.multiple !== undefined && oneUIControl.multiple !== null && oneUIControl.multiple)
            return true;
        else
            return false;
    }

    let nextUniqueInputId = 0;
    function getNextUniqueId() {
        nextUniqueInputId++;
        return "_" + nextUniqueInputId;
    }

    return {
        renderUI: renderUI,
    }
}
