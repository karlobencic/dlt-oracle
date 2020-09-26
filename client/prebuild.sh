path_src=../truffle.js
path_dst=./src/truffle/truffle.js

cp $path_src $path_dst

sed -i '' '/HDWalletProvider/d' $path_dst
