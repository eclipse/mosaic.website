---
title: ns-3 Federate Development Setup
linktitle: ns-3 Federate
toc: true
type: docs
date: "2021-07-23T20:00:00+02:00"
draft: false
weight: 65
menu:
  docs:
    parent: extending_mosaic
---

The following instructions steps lead you to a common **development setup for the Eclipse MOSAIC ns-3 Federate**.

{{% alert note %}}
**For the Eclipse MOSAIC ns-3 Federate development you should be familiar with:**
- Eclipse MOSAIC
- C++ development
- ns-3
{{% /alert %}}

## Dependency installation

### Google Protocol Buffers 
**Make sure you have the following dependency installed before you continue:**
- Google Protocol Buffers (protobuf)

### Premake 5
There are multiple ways how you can install Premake 5 ([https://premake.github.io/](https://premake.github.io/)).  
For our purpose it doesn't matter which way you choose: 
- install package of your Linux distribution **or**
- download binary **or**
- build from source

### ns-3
1. Download ns-3: https://www.nsnam.org/releases/ns-allinone-{{< version of="ns3" >}}.tar.bz2
2. Run `./build.py`


## Download & Install Eclipse MOSAIC ns-3 Federate

1. Clone the federate's repository: `git clone https://github.com/mosaic-addons/ns3-federate`    
   The federate's repository directory is referred to as `[federate]`.
2. Install the Premake 5 Autoconf Plugin to `[federate]/.modules/autoconf`:
   1. `cd [federate]`
   2. `wget -O premake-autoconf.zip https://github.com/Blizzard/premake-autoconf/archive/master.zip`
   3. `unzip premake-autoconf.zip -d .modules/autoconf`
3. **Setup `premake5.lua`** – Premake5 is configured by the file `[federate]/premake5.lua` of the federate project.  
   Unfortunately, the build definitions have been historically grown and are interlocked with the installer script.  
   In order to start development at the federate, you need to change a few parts in `premake5.lua`:
   - The installer script copies `ClientServerChannel.*`. This is not necessary -> uncomment 2 lines:
      ```lua
         files { "src/**.h"
               , "src/**.cc"
      --         , PROTO_CC_PATH .. "/ClientServerChannel.h"
      --         , PROTO_CC_PATH .. "/ClientServerChannel.cc"
               , PROTO_CC_PATH .. "/ClientServerChannelMessages.pb.h"
               , PROTO_CC_PATH .. "/ClientServerChannelMessages.pb.cc"
               }
      ```
   - add path to ns-3 include directory:
      ```lua
      includedirs { "/usr/include"
                  , "/usr/include/libxml2"
                  , "src"
                  , "/absolute/path/ns-allinone-{{< version of="ns3" >}}/ns-{{< version of="ns3" >}}/build"
                  , PROTO_CC_PATH
                  }
      ```
   - add path to ns-3 lib directory:
      ```lua
      libdirs { "/usr/lib"
              , "/absolute/path/ns-allinone-{{< version of="ns3" >}}/ns-{{< version of="ns3" >}}/build/lib"
              }
      ```
      There are alternative and more eloquent configuration ways. Keep up to date! There might be some changes introduced.
4. **Makefile Generation** – Having configured premake, you can run it to generate the Makefiles:  
   1. `cd [federate]`
   2. `premake5 gmake --generate-protobuf`
5. **Build Federate** – Having generated the federate's Makefiles, the federate can be built.
   - Option 1: Simple build with `make -j1`  
     _Building in parallel might cause errors, so the use of one thread (parameter `-j1`) is recommended._
   - Option 2: Build and Generate `compile_commands.json` – *Clang* defines a
     [database format for compilation information](https://clang.llvm.org/docs/JSONCompilationDatabase.html),
     containing necessary information to build the project which enables different tools to parse the source code in the same
     way (flags/debug/release/dependency version...). This is needed by VS Code's plugin *clangd*.  
     (If you use an IDE which does not need this database, you can omit this *option 2*.)
     1. Install a software capable of generation of `compile_commands.json`.
        For instance [compiledb](https://github.com/nickdiego/compiledb), whose installation is shown below.
     2. Call that software
     3. Build federate
    
     ```shell
     pip install compiledb  # or some other installation method
     cd [federate]
     compiledb make -j1
     ```
     After run of the last command, `compile_commands.json` is generated in the current directory and can be read by VS Code's plugin *clangd*.
6. **Test Installation** – Run with MOSAIC with ns-3:
   1. Adjust the ns-3-section of MOSAIC's `runtime.json`:
      ```
      ...
      "deploy": false,
      "start": false,
      ...
      ```
   2. Run federate in IDE
   3. Run MOSAIC with an scenario having ns-3 enabled.


## Developing Eclipse MOSAIC ns-3 Federate with Visual Studio Code 
This section describes the use of [_Visual Studio Code_](https://code.visualstudio.com/) (VS Code).
You should be familiar with VS Code's basic usage.

Alternatively you can use any other development environment like:  
- VIM
- Eclipse
- NetBeans
- Code::Blocks
- JetBrains CLion
- ...

### Plugins
This setup assumes the following VS Code plugins are installed:
- clangd
- CodeLLDB

### Tasks, Launch: Examples
For basic debugging and building you can use these configuration files. They define

- a build task,
- a debug launch configuration.

`.vscode/launch.json`:
```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [

        {
            "type": "lldb",
            "request": "launch",
            "name": "Debug",
            "program": "${workspaceFolder}/bin/Debug/ns3-federate",
            "args": ["--port=5011", "--configFile=ns3_federate_config.xml"],
            "cwd": "${workspaceFolder}",
            "env": {"LD_LIBRARY_PATH":"/absolute/path/ns-allinone-{{< version of="ns3" >}}/ns-{{< version of="ns3" >}}/build/lib"}
        }
    ]
}
```

`.vscode/tasks.json`:
```
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "label": "make",
            "type": "shell",
            "command": "make -j1",
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "presentation": {
                "reveal": "always",
                "panel": "new"
            },
            "problemMatcher": []
        }
    ]
}
```
