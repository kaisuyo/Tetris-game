class game {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        this.canvas.height = HEIGHT;
        this.canvas.width = WIDTH;

        document.body.appendChild(this.canvas);

        this.context.fillRect(0, 0, WIDTH, HEIGHT);

        this.grade = new grade(this);
        this.score = 0;

        this.loop();
    }

    loop() {
        this.draw();
        this.update();
        setTimeout( () => this.loop(), 1000/FPS);
    }

    update() {
        // nếu chưa thua thì update
        if (!this.isOver()) {
            // kiểm tra xem khối hiện tại đã dừng lại chưa
            // nếu rồ thì lưu lại các tọa độ vào mảng SCR
            if (this.stop()) {

                this.grade.dots.forEach(
                    x => {
                        SCR[x.x/BRICK_SIZE][x.y/BRICK_SIZE + 4].full = true;
                        SCR[x.x/BRICK_SIZE][x.y/BRICK_SIZE + 4].image = this.grade.image;
                    }
                );
                // sau khi lưu xong thì kiểm tra và tạo khối mới
                this.grade.unbuild();
                this.grade = new grade(this);
            } else {
                // nếu khối chưa dừng lại thì tiếp tục cho trôi xuống
                this.grade.update();
            }
        }
    }

    isOver() {
        for(let i = 0; i < 10; i++) {
            // nếu có 1 phần tử trên cùng nào full thì over
            if (SCR[i][4].full) {
                return true;
            }
        }
        return false;
    }

    stop() {
        for (let i = 0; i < 4; i++) {
            // trong tất cả các phần tử của khối hiện tại
            // chỉ cần có 1 phần tử không xuống được thì cả khối ko xuống được
            if (!this.isDown(this.grade.dots[i])) {
                return true;
            }
        }
        return false;
    }

    isDown(n) {
        if (n.y + BRICK_SIZE >= HEIGHT) {
            return false;
        }

        // tọa độ ô có vị trí cao nhất từ dưới lên thẳng với n
        let d = Math.floor((n.y+BRICK_SIZE)/BRICK_SIZE) + 4;
        if (SCR[n.x/BRICK_SIZE][d].full) {
            return false;
        }
        return true;
    }

    draw() {
        //xóa màn hình
        this.context.fillRect(0, 0, WIDTH, HEIGHT);
        // vẽ các khối
        this.grade.draw();
        // vẽ các khối đã có
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 24; j++) {
                if (SCR[i][j].full) {
                    this.context.drawImage(
                        SCR[i][j].image,
                        i*BRICK_SIZE,
                        (j-4)*BRICK_SIZE,
                        BRICK_SIZE,
                        BRICK_SIZE
                    );
                }
            }
        }
    }
}

var g = new game();