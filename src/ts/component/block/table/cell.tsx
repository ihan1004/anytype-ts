import * as React from 'react';
import { I } from 'ts/lib';
import { Icon, Block } from 'ts/component';
import { observer } from 'mobx-react';
import { blockStore } from 'ts/store';
import { SortableHandle } from 'react-sortable-hoc';

interface Props extends I.BlockComponentTable {
	rowIdx: number;
	columnIdx: number;
};

const Constant = require('json/constant.json');

const BlockTableCell = observer(class BlockTableCell extends React.Component<Props, {}> {

	render () {
		const { rootId, block, readonly, isHead, rowIdx, columnIdx, getData, onOptions, onCellFocus, onCellBlur, onClick, onSort, onResizeStart } = this.props;
		const { rows, columns } = getData();
		const row = rows[rowIdx];
		const column = columns[columnIdx];
		const childrenIds = blockStore.getChildrenIds(rootId, block.id);
		const inner = blockStore.getLeaf(rootId, childrenIds[0]);

		if (!row || !column || !inner) {
			return null;
		};

		const cn = [ 'cell', 'column' + column.id, /* 'align-v' + block.vertical, 'align-h' + block.horizontal */ ];
		const length = childrenIds.length;
		const bgColor = block.bgColor || column.bgColor || row.bgColor;
		const css: any = {
			width: column.fields.width || Constant.size.table.cell,
		};

		if (isHead) {
			cn.push('isHead');
		};
		/*
		if (cell.color) {
			cn.push('textColor textColor-' + cell.color);
		};
		*/
		if (bgColor) {
			cn.push('bgColor bgColor-' + bgColor);
		};

		const HandleColumn = SortableHandle((item: any) => (
			<div 
				className="icon handleColumn"
				onClick={(e: any) => { onOptions(e, item.id); }}
				onContextMenu={(e: any) => { onOptions(e, item.id); }}
			/>
		));

		const HandleRow = SortableHandle((item: any) => (
			<div 
				className="icon handleRow"
				onClick={(e: any) => { onOptions(e, item.id); }}
				onContextMenu={(e: any) => { onOptions(e, item.id); }}
			/>
		));

		return (
			<div
				id={`block-${block.id}`}
				className={cn.join(' ')}
				style={css}
				onMouseDown={(e: any) => { onClick(e, block.id); }}
				onContextMenu={(e: any) => { onOptions(e, block.id); }}
			>
				{isHead ? <HandleColumn {...column} /> : ''}
				{!columnIdx ? <HandleRow {...row} /> : ''}

				<Block 
					key={'table-' + inner.id} 
					{...this.props} 
					block={inner} 
					rootId={rootId} 
					readonly={readonly} 
					isInsideTable={true}
					className="noPlus"
					onFocus={(e: any) => { onCellFocus(e, block.id); }}
					onBlur={(e: any) => { onCellBlur(e, block.id); }}
					getWrapperWidth={() => { return Constant.size.editor; }} 
				/>

				<div className="resize" onMouseDown={(e: any) => { onResizeStart(e, column.id); }} />
				<Icon className="menu" onClick={(e: any) => { onOptions(e, block.id); }} />
			</div>
		);
	};
	
});

export default BlockTableCell;