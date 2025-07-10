export default {
  root: {
    textAlign: 'right',
  },
  css: ({ dt }: { dt: (path: string) => string }) => `
    .p-inputnumber-input {
      text-align: ${dt('inputnumber.root.textAlign')};
    }
    .p-inputnumber .p-inputtext {
      text-align: ${dt('inputnumber.root.textAlign')};
    }
    .p-float-label .p-inputnumber .p-inputtext {
      text-align: ${dt('inputnumber.root.textAlign')};
    }
  `,
}
