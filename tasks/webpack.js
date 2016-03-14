const gulp = require('gulp');
const webpack = require('webpack-stream');

gulp.task('webpack',(cb)=>{
	return gulp.src('src/Studio.jsx')
	  .pipe(webpack( require('../webpack.production.config.js') ))
	  .pipe(gulp.dest('dist/'));
});


const colors = require("colors");

const walk = (p, callback)=>{
    var results = [];

    fs.readdir(p,  (err, files) => {
      if (err) throw err;

      var pending = files.length;
      if (!pending) return callback(null, results); //全てのファイル取得が終わったらコールバックを呼び出す

      files.map( (file)=>{ //リスト取得
        return path.join(p, file);
      }).filter( (file)=> {
        if(fs.statSync(file).isDirectory()) walk(file, (err, res)=>{ //ディレクトリだったら再帰
          results.push({name:path.basename(file), children:res}); //子ディレクトリをchildrenインデックス配下に保存
          if (!--pending) callback(null, results);
         });
        return fs.statSync(file).isFile();
      }).forEach( (file)=>{ //ファイル名を保存
        var stat = fs.statSync(file);
        results.push({file:path.basename(file), size:stat.size});
        if (!--pending) callback(null, results);
      });
    });
}

const fs = require("fs");
const path = require("path");

gulp.task("a",()=>{
	const nodePath = require('app-root-path').resolve("node_modules");
	const Table = require('cli-table');

	var table = new Table({
					    head: ['name','current version', 'parent version'], 
					    colWidths: [30,20,20]
					});

    fs.readdir(nodePath, (err, files) => {
    	if (err) throw err;

    	const dirs = files.map((file)=>{ //リスト取得
				        return path.join(nodePath, file);
				     }).filter((file)=>{
					 	if(fs.statSync(file).isDirectory()){ 
					    	return file;
					    } 
				     });

		const packageData = JSON.parse(fs.readFileSync(require('app-root-path').resolve("package.json")));
		const dependencies = Object.assign(packageData.dependencies,packageData.devDependencies)

		dirs.forEach((dir)=>{
			fs.readdir(dir, (err, files) => {
				if (err) throw err;

				files.forEach((file)=>{ //リスト取得
				    if(file === "package.json" && !fs.statSync(file).isDirectory()){
				    	fs.readFile(path.join(dir,file),(err,data)=>{
				    		if (err) throw err;

				    		let name = path.parse(dir).name;
				    		let dependVer = dependencies[name];

				    		if(dependVer != null){
				    			let currentVerArray = JSON.parse(data).version.split(".");
				    			
				    			if(dependVer.charAt(0).match(/\D/)){
				    				dependVer = dependVer.substr(1);
				    			}
				    			let dependVerArray = dependVer.split(".")

								if(checkVersion(dependVerArray,currentVerArray)){
									process.stdout.write(`${name} `.green);
					    			process.stdout.write(`${dependVer} `.green);
					    			process.stdout.write(`${currentVerArray.join(".")}\n`.green);
								}
				    		}
				    	});
				    }
				});
			});
		});
	});
});

const checkVersion = (dependVerArray,currentVerArray)=>{
	return  dependVerArray.some((elem,index)=>{
				if(elem < currentVerArray[index]) return true;
			});
}