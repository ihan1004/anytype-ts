import * as React from 'react';
import { I, history as historyPopup } from 'ts/lib';
import { RouteComponentProps } from 'react-router';
import { Page } from 'ts/component';
import { observer } from 'mobx-react';

interface Props extends I.Popup, RouteComponentProps<any> {};

const $ = require('jquery');
const raf = require('raf');

@observer
class PopupPage extends React.Component<Props, {}> {

	_isMounted: boolean = false;
	ref: any = null;

	render () {
		const { param } = this.props;
		const { data } = param;
		const { matchPopup } = data;

		return (
			<div id="wrap">
				<Page 
					ref={(ref: any) => { this.ref = ref; }} 
					{...this.props} 
					rootId={matchPopup.params.id} 
					isPopup={true} 
					matchPopup={matchPopup} 
				/>
			</div>
		);
	};

	componentDidMount () {
		this._isMounted = true;
		this.rebind();
		this.resize();
	};

	componentWillUnmount () {
		this._isMounted = false;
		this.unbind();
		historyPopup.clear();
	};

	rebind () {
		if (!this._isMounted) {
			return;
		};
		
		this.unbind();
		
		const win = $(window);
		win.unbind('resize.popupPage').on('resize.popupPage', () => { this.resize(); });
	};

	unbind () {
		$(window).unbind('resize.popupPage');
	};

	resize () {
		if (!this._isMounted) {
			return;
		};

		const { getId, position } = this.props;

		raf(() => {
			const win = $(window);
			const obj = $(`#${getId()} #innerWrap`);
			const width = Math.max(980, Math.min(1152, win.width() - 128));

			console.log('width', width);

			obj.css({ width: width });
			position();
		});
	};

};

export default PopupPage;