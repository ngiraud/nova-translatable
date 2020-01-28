export default {
  data: () => ({
    value: {},
    activeLocale: void 0,
    originalFieldName: void 0,
  }),

  created() {
    this.value = this.getInitialValue();
    this.originalFieldName = this.field.name;
    this.activeLocale = this.getActiveLocale();

    // Listen to all locale event
    Nova.$on('nova-translatable@setAllLocale', this.setLocale);
  },

  destroyed() {
    Nova.$off('nova-translatable@setAllLocale', this.setLocale);
  },

  computed: {
    locales() {
      return Object.keys(this.field.translatable.locales).map(key => ({
        key,
        name: this.field.translatable.locales[key],
      }));
    },
    fieldValueMustBeAnObject() {
      return ['key-value-field'].includes(this.field.translatable.original_component)
    }
  },

  methods: {
    getInitialValue() {
      const initialValue = {};
      for (const locale of this.locales) {
        initialValue[locale.key] = this.formatValue(this.field.translatable.value[locale.key] || '');
      }

      return initialValue;
    },

    getActiveLocale() {
      let localesFiltered = this.locales.filter(({key}) => key === Nova.config.locale);

      if(localesFiltered.length === 0) {
        localesFiltered = this.locales;
      }

      return localesFiltered[0].key;
    },

    setLocale(newLocale) {
      // Set new activeLocale
      this.activeLocale = newLocale;
    },

    setAllLocale(newLocale) {
      Nova.$emit('nova-translatable@setAllLocale', newLocale);
    },

    removeBottomBorder() {
      if (!this.$refs.main) return false;
      return this.$refs.main.classList.contains('remove-bottom-border');
    },

    formatValue(value) {
      let valueFormatted = value || ''

      if(this.fieldValueMustBeAnObject && !_.isObject(valueFormatted)) {
        valueFormatted = valueFormatted === '' ? {} : JSON.parse(valueFormatted)
      }

      return valueFormatted
    }
  },
};
