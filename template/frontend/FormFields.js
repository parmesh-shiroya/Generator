exports.InputTextField = () => {
  return `
    <Form.Item
    /*__GG_FORM_ITEM_ATTR__*/
  >
    <Input allowClear /*__GG_INPUT_ATTR__*/ />
  </Form.Item>
    `
}
exports.InputTextPasswordField = () => {
  return `
  <Form.Item
  /*__GG_FORM_ITEM_ATTR__*/
>
  <Input.Password allowClear /*__GG_INPUT_ATTR__*/ />
</Form.Item>
  `
}

exports.InputSelectField = () => {
  return `
    <Form.Item /*__GG_FORM_ITEM_ATTR__*/>
    <Select /*__GG_SELECT_ATTR__*/>
        /*__GG_SELECT_OPTIONS__*/
    </Select>
  </Form.Item>
  `
}



exports.InputSwitchField = () => {
  return `
    <Form.Item /*__GG_FORM_ITEM_ATTR__*/>
        <Switch /*__GG_SWITCH_ATTR__*/ />
  </Form.Item>
  `
}