class grade {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.context = game.context;

        this.image = new Image;
        this.color = null;

        this.dots = [];
        this.x = 4*BRICK_SIZE;
        this.y = -WIDTH/10;

        this.key = null;
        this.gradeNum = null;

        this.rand();
    }

    rand() {
        // chọn màu 
        let r = Math.floor(Math.random()*7);
        this.image.src = HEAD + COLOR[r] + TAIL;
        // chọn kiểu hình
        this.gradeNum = Math.floor(Math.random()*7);
        let grade = [this.I(), this.L(), this.J(), this.O(), this.S(), this.T(), this.Z()];
        this.dots = grade[this.gradeNum];
        // chọn hình
        let g = Math.floor(Math.random()*4);
        for (let i = 0; i < g; i++) {
            this.up();
        }
    }

    update() {
        // chuyển động xuống liên tục của các khối
        this.dots.forEach( x => {
            x.y ++;
        });

        // tạo các sự kiện điều khiển
        addEventListener("keydown", e => {
            if (e.keyCode == 37) this.key = "left";
            if (e.keyCode == 38) this.key = "up";
            if (e.keyCode == 39) this.key = "right";
            if (e.keyCode == 40) this.key = "down";
        });

        if (this.key == "left") {
            if (this.isLeftGrade()) {
                this.dots.forEach( x => {
                    x.x -= BRICK_SIZE;
                });
            }
        }
        if (this.key == "right") {
            if (this.isRightGrade()) {
                this.dots.forEach( x => {
                    x.x += BRICK_SIZE;
                });
            }
        }
        if (this.key == "down") {
            this.down();
        }
        if (this.key == "up") {
            this.up();
        }
        // sau khi nhấn và nhả phím thì key trở về trạng thái cũ
        // để  tránh bị sang trái, sang phải liên tục
        this.key = null;
    }

    draw() {
        this.dots.forEach( x => {
            this.context.drawImage(
                this.image,
                x.x,
                x.y,
                BRICK_SIZE,
                BRICK_SIZE
            )
        });
    }

    // các hàm kiểm tra điều khiển

    // kiểm tra xem khối hiện tại có thể di chuyển sang trái được hay không
    isLeftGrade() {
        for (let i = 0; i < 4; i++) {
            //nếu trong khối có 1 phần tử ko sang đc thì cả khối không sang đc
            if (!this.isLeft(this.dots[i])) {
                return false;
            }
        }
        return true;
    }
    // kiểm tra xem phần tử n có thể sang trái đc hay không
    isLeft(n) {
        // N: vị trí mà n sẽ sang
        let N = {
            x: n.x - BRICK_SIZE,
            y: n.y
        }
        // kiểm tra N có hợp lệ hay không
        // 
        if (N.x < 0) {
            return false;
        }
        // tọa độ của ô chứa tọa độ điểm N
        // không liên quan đến SCR
        let d = Math.floor(N.y/BRICK_SIZE);
        // kiểm tra góc trên bên trái của phần tử
        // vẫn cho phép lệch 1 chút SMALL_NUM
        if (N.y < d*BRICK_SIZE - SMALL_NUM) {
            return false;
        }
        // kiểm ta góc dưới bên trái phần tử
        // có liên quan đến SCR
        if (this.meet(N)) {
            return false;
        }

        return true;
    }
    // kiểm tra khối hiện tại có sang phải đc hay không
    isRightGrade() {
        for (let i = 0; i < 4; i++) {
            if (!this.isRight(this.dots[i])) {
                return false;
            }
        }
        return true;
    }

    isRight(n) {
        // N: vị trí mà n sẽ sang
        let N = {
            x: n.x + BRICK_SIZE,
            y: n.y
        }
        // kiểm tra N có hợp lệ hay không
        // 
        if (N.x >= WIDTH) {
            return false;
        }
        // tọa độ của ô chứa tọa độ điểm N
        // không liên quan đến SCR
        let d = Math.floor(N.y/BRICK_SIZE);
        // kiểm tra góc trên bên trái của phần tử
        // vẫn cho phép lệch 1 chút SMALL_NUM
        if (N.y < d*BRICK_SIZE - SMALL_NUM) {
            return false;
        }
        // kiểm ta góc dưới bên trái phần tử
        // có liên quan đến SCR
        if (this.meet(N)) {
            return false;
        }

        return true;
    }

    down() {
        while (!this.game.stop()) {
            this.dots.forEach( x => x.y++);
        }
    }

    up() {
        // khối vuông thì không cần xoay
        if (this.gradeNum != 3) {
            let arrTemp = [];
            for (let i = 0; i < 4; i++) {
                // tâm I là dots[1]
                let I = {
                    x: this.dots[1].x,
                    y: this.dots[1].y
                }
                let A = {
                    x: this.dots[i].x,
                    y: this.dots[i].y
                }
                // công thức copy trên mạng
                // góc quay -PI/2
                arrTemp.push({
                    x: (A.y - I.y) + I.x,
                    y: -(A.x - I.x) + I.y
                });
                // trước khi xoay phải kiểm tra tính hợp lệ
            }
            // lọc những khối không lợp lệ
            let z = arrTemp.filter( x => (
                // quá bên trái
                x.x < 0 ||
                // quá bên phải
                x.x + BRICK_SIZE > WIDTH ||
                // trùng vào phần tử đã có trong SCR
                this.meet(x)
            ));
            if (z.length == 0) {
                this.dots = arrTemp;
            }
        }
    }

    meet(n) {
        // góc dưới bên trái của phần tử  nằm trong phần tử 
        // bất kì của SCR thì tức là đang giao nhau
        let b = Math.floor((n.y + BRICK_SIZE)/BRICK_SIZE) + 4;
        if (SCR[n.x/BRICK_SIZE][b].full) {
            return true;
        }
        return false;
    }
    // kiểm tra xem có hàng nào đủ chưa để phá 
    // trả về mảng giá trị các hàng có thể phá
    checkUnbuild() {
        let z = [];
        for (let i = 23; i >= 4; i--) {
            let t = [];
            for (let j = 0; j < 10; j++) {
                if (SCR[j][i].full) {
                    // nếu ô full thì thêm 1 vào mảng t
                    t.push(1);
                }
            }
            // nếu t.length = 10 thì hàng này xóa đc
            if (t.length == 10) {
                // hàng i xóa đc
                z.push(i);
            }
        }
        return z;
    }
    // phá
    unbuild() {
        let z = this.checkUnbuild();
        // xóa 1 hàng thì thêm 1 hàng
        z.forEach( x => {
            for (let i = 0; i < 10; i++) {
                SCR[i].splice(x,1);
            }
        });
        for (let i = 0; i < z.length; i++) {
            for (let j = 0; j < 10; j++) {
                SCR[j].unshift({
                    full: false,
                    image: null
                });
            }
        }
    }

    // tạo tọa độ các hình
    // sử dụng a[1] làm tâm quay
    I() {
        let a = [];
        for (let i = 0; i < 4; i++) {
            a.push({
                x: this.x,
                y: this.y - i*BRICK_SIZE
            });
        }
        return a;
    }
    L() {
        let a = this.I();
        a[3].x = this.x + BRICK_SIZE;
        a[3].y = this.y;
        return a;
    }
    J() {
        let a = this.I();
        a[3].x = this.x - BRICK_SIZE;
        a[3].y = this.y;
        return a;
    }
    O() {
        let a = this.L();
        a[2].x = this.x + BRICK_SIZE;
        a[2].y = this.y - BRICK_SIZE;
        return a;
    }
    Z() {
        let a = this.O();
        a[3].x = this.x + BRICK_SIZE;
        a[3].y = this.y - 2*BRICK_SIZE;
        return a;
    }
    S() {
        let a = this.J();
        a[2].x = this.x + BRICK_SIZE;
        a[2].y = this.y - BRICK_SIZE;
        return a;
    }
    T() {
        let a = this.S();
        a[3].y -= BRICK_SIZE;
        return a;
    }
}