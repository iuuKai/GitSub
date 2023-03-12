/*
 * @Author: iuukai
 * @Date: 2022-10-21 05:47:03
 * @LastEditors: iuukai
 * @LastEditTime: 2023-02-16 23:40:18
 * @FilePath: \gitsub\src\plugins\antd.js
 * @Description:
 * @QQ/微信: 790331286
 */
import Antd, { Button, Switch, Input, Checkbox, Row, message } from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css';
// import 'ant-design-vue/dist/antd.variable.min.css'
// import 'dayjs/locale/zh-cn';

export function setupAntd(app) {
	message.config({
		top: '70px'
	})
	// 引入cdn后，不需要按需导入了
	app.use(Antd)
	// app.use(Button).use(Switch).use(Input).use(Checkbox).use(Row)
	// .use(Form)
	// .use(Input)
	// .use(Modal)
	// .use(Table)
	// .use(Menu)
	// .use(Card)
	// .use(Checkbox)
	// .use(Radio)
	// .use(Col)
	// .use(Row)
	// .use(Select)
	// .use(DatePicker)
}
