define(
  ["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    'dojo/on',
    "dojo/text!./EditFields.html",
     "./FieldValidation",
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    "jimu/dijit/Popup"
  ],
  function (
    declare,
    lang,
    array,
    on,
    template,
    FieldValidation,
    _TemplatedMixin,
    BaseWidgetSetting,
    Table,
    Popup) {
    return declare([BaseWidgetSetting, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-fields",
      templateString: template,
      _layerInfo: null,
      postCreate: function () {
        this.inherited(arguments);
        this.nls = lang.mixin(this.nls, window.jimuNls.common);
        this._initFieldsTable();
        this._setFiedsTable(this._layerInfo.fieldInfos);
      },

      popupEditPage: function () {
        var fieldsPopup = new Popup({
          titleLabel: this.nls.configureFields,
          width: 720,
          maxHeight: 600,
          autoHeight: true,
          content: this,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              this._resetFieldInfos();
              fieldsPopup.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              fieldsPopup.close();
            })
          }],
          onClose: lang.hitch(this, function () {
          })
        });
      },

      _initFieldsTable: function () {
        var fields2 = [{
          name: 'isEditable',
          title: this.nls.edit,
          type: 'checkbox',
          'class': 'editable',
          width: '90px'
        }, {
          name: 'fieldName',
          title: this.nls.editpageName,
          type: 'text'
        }, {
          name: 'label',
          title: this.nls.editpageAlias,
          type: 'text',
          editable: true
        }, {
          name: 'canPresetValue',
          title: this.nls.canPresetValue,
          type: 'checkbox',
          'class': 'presetValue',
          width: '100px'
        }, {
          name: 'actions',
          title: this.nls.actions,
          type: 'actions',
          actions: ['up', 'down', 'edit'],
          'class': 'editable'
        }];
      
        var args2 = {
          fields: fields2,
          selectable: false,
          style: {
            'height': '300px',
            'maxHeight': '300px'
          }
        };
        this._fieldsTable = new Table(args2);
        this._fieldsTable.placeAt(this.fieldsTable);
        this._fieldsTable.startup();
        this.own(on(this._fieldsTable,
          'actions-edit',
          lang.hitch(this, this._onEditFieldInfoClick)));
      },
      _onEditFieldInfoClick: function (tr) {
        var rowData = this._fieldsTable.getRowData(tr);
        if (rowData) {

          var fieldValid = new FieldValidation({
            nls: this.nls,
            _layerInfo: this._layerInfo,
            _fieldName: rowData.fieldName
          });
          fieldValid.popupActionsPage();
        }
      },
      _setFiedsTable: function (fieldInfos) {
        array.forEach(fieldInfos, function (fieldInfo) {
          this._fieldsTable.addRow({
            fieldName: fieldInfo.fieldName,
            isEditable: fieldInfo.isEditable,
            canPresetValue: fieldInfo.canPresetValue,
            label: fieldInfo.label
          });
        }, this);
      },

      _resetFieldInfos: function () {
        var newFieldInfos = [];
        var fieldsTableData = this._fieldsTable.getData();
        array.forEach(fieldsTableData, function (fieldData) {
          newFieldInfos.push({
            "fieldName": fieldData.fieldName,
            "label": fieldData.label,
            "canPresetValue": fieldData.canPresetValue,
            "isEditable": fieldData.isEditable
          });
        });

        this._layerInfo.fieldInfos = newFieldInfos;
      }
   
    });
  });