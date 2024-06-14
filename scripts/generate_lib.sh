read -p "Enter library name: " LIBRARY
nx generate @nx/js:lib $LIBRARY --directory=libs/$LIBRARY --importPath=@glimmer/$LIBRARY     