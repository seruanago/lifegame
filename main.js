
var CELL_WIDTH = 3;									// セルの幅
var SIDE_CELL_NUM = 240;						// 1辺のセル数
var CANVAS_WIDTH = CELL_WIDTH * SIDE_CELL_NUM;	// キャンバスの幅
var FPS = 5;												// FPS
var FRAME_TIME_MSEC = 1000 / FPS;	// 1フレームのミリ秒
var canvas;
var context;

var field;
var prevField;

var CELL_COLOR = [];
CELL_COLOR[0] = 'rgb(0,0,255)';
CELL_COLOR[1] = 'rgb(0,128,255)';
CELL_COLOR[2] = 'rgb(0,255,255)';
CELL_COLOR[3] = 'rgb(0,255,128)';
CELL_COLOR[4] = 'rgb(0,255,0)';
CELL_COLOR[5] = 'rgb(128,255,0)';
CELL_COLOR[6] = 'rgb(255,255,0)';
CELL_COLOR[7] = 'rgb(255,128,0)';
CELL_COLOR[8] = 'rgb(255,0,0)';

// 初期化処理
window.onload = function()
{	
	// キャンバスを取得して、サイズを設定
	canvas = document.getElementById( 'world' );
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_WIDTH;
	canvas.style.width = CANVAS_WIDTH+'px';
	canvas.style.height = CANVAS_WIDTH+'px';
	
	context = canvas.getContext( '2d' );
	context.fillStyle = 'rgb(0,0,0)';
	
	field = new Array(SIDE_CELL_NUM * SIDE_CELL_NUM);
	prevField = new Array(SIDE_CELL_NUM * SIDE_CELL_NUM);
	for( var i = 0; i < field.length; i++ )
	{
		prevField[i] = Math.floor(Math.random()*2);
	}
	
	mainLoop();
}

// メインループ
function mainLoop()
{
	update();
	draw();
	
	setTimeout( mainLoop, FRAME_TIME_MSEC );	
}

// (x,y)のセルを取得
function getFieldCell( field, x, y )
{
	if( x < 0 || x > SIDE_CELL_NUM - 1 ||
		y < 0 || y > SIDE_CELL_NUM - 1 )
	{
		return 0;
	}
	return field[ x + y * SIDE_CELL_NUM ];
}

// セル(x,y)を設定
function setFieldCell( field, x, y, val )
{
	if( x < 0 || x > SIDE_CELL_NUM - 1 ||
		y < 0 || y > SIDE_CELL_NUM - 1 )
	{
		return;
	}
	field[ x + y * SIDE_CELL_NUM ] = val;
}

// (x,y)の周囲8マスの生存個数を調べる
function getAroundAliveNum( field, x, y )
{
	var n = 0;
	for( var j = -1; j <= 1; j++ )
	{
		for( var i = -1; i <=1; i++ )
		{
			if( i == 0 && j == 0 )
			{
				// 自分自身はカウントしない
				continue;
			}
			
			if( getFieldCell( field, x + i, y + j ) )
			{
				n++;
			}
		}
	}
	return n;
}

// 更新
function update()
{
	// 前フレームの状態からフィールドの状態を決定する
	for( var y = 0; y < SIDE_CELL_NUM; y++ )
	{
		for( var x = 0; x < SIDE_CELL_NUM; x++ )
		{
			// 周りの生存個数
			var n = getAroundAliveNum( prevField, x, y );
			
			var nextVal = 0;
			/*
				Wikipedia「ライフゲーム」参照
				誕生:死んでいるセルに隣接する生きたセルがちょうど3つあれば、次の世代が誕生する。
				生存:生きているセルに隣接する生きたセルが2つか3つならば、次の世代でも生存する。
				(過疎:生きているセルに隣接する生きたセルが1つ以下ならば、過疎により死滅する。)
				(過密:生きているセルに隣接する生きたセルが4つ以上ならば、過密により死滅する。)
			*/
			if( (!getFieldCell( prevField, x, y ) && n == 3) ||
				(getFieldCell( prevField, x, y ) && (n == 2 || n == 3)) )
			{
				nextVal = 1;
			}
			
			setFieldCell( field, x, y, nextVal );
		}
	}
	
	// フィールドを保存
	prevField = field.slice();
}
	
// 描画
function draw()
{
	context.clearRect( 0, 0, CANVAS_WIDTH, CANVAS_WIDTH );
	for( var y = 0; y < SIDE_CELL_NUM; y++ )
	{
		for( var x = 0; x < SIDE_CELL_NUM; x++ )
		{
			if( getFieldCell( field, x, y ) )
			{
				// 周りの生存個数によって、ヒートマップ的な色をつける
				context.fillStyle = CELL_COLOR[ getAroundAliveNum( field, x, y ) ];
				context.fillRect( x * CELL_WIDTH, y * CELL_WIDTH, CELL_WIDTH, CELL_WIDTH );
			}
		}
	}
}
		