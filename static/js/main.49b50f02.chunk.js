(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{5425:function(e,t,a){e.exports=a(5585)},5430:function(e,t,a){},5431:function(e,t,a){},5585:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(17),o=a.n(r),i=(a(5430),a(22)),c=a(23),s=a(25),m=a(24),d=a(26),u=(a(5431),a(94)),h=a(20),E=a(2),g=a(19),p=a(62),b=a.n(p),f=a(45),C=a.n(f),v=a(44),w=a.n(v),y=a(63),k=a.n(y),D=a(95),O=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,l=new Array(n),r=0;r<n;r++)l[r]=arguments[r];return(a=Object(s.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(l)))).state={open:!1,selectedModeKey:0,selectedLinkKey:null},a.handleToggleDrawer=function(){a.setState(function(e){return{open:!e.open}})},a.handleModeListItemClick=function(e,t){a.setState({selectedModeKey:t,selectedLinkKey:null})},a.handleLinkListItemClick=function(e,t){a.setState({selectedLinkKey:t,selectedModeKey:null})},a}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this,t=this.props.classes,a=this.state,n=a.open,r=a.selectedModeKey,o=a.selectedLinkKey,i=l.a.createElement("div",{className:t.list},l.a.createElement(E.n,null,[["DFA",1],["NFA",2],["NFA to DFA",3],["ENFA to NFA",4],["DFA Minimization",5]].map(function(t){var a=Object(D.a)(t,2),n=a[0],o=a[1];return l.a.createElement(E.o,{key:o,button:!0,selected:r===o,onClick:function(t){return e.handleModeListItemClick(t,o)}},l.a.createElement(E.p,{primary:n}))})),l.a.createElement(E.j,null),l.a.createElement(E.n,null,[["Examples",1],["Tutorial",2],["GitHub",3],["Feedback",4]].map(function(t){var a=Object(D.a)(t,2),n=a[0],r=a[1];return l.a.createElement(E.o,{key:r,button:!0,selected:o===r,onClick:function(t){return e.handleLinkListItemClick(t,r)}},l.a.createElement(E.p,{primary:n}))})));return l.a.createElement("div",null,l.a.createElement(E.k,{open:n,onClose:this.handleToggleDrawer},l.a.createElement("div",{tabIndex:0,role:"button",onClick:this.handleToggleDrawer,onKeyDown:this.handleToggleDrawer},i)))}}]),t}(n.Component),N=Object(g.withStyles)({list:{width:250}})(O),x=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(s.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={mobileMoreAnchorEl:null},a.TemporaryDrawerRef=l.a.createRef(),a.handleToggleDrawer=function(){a.TemporaryDrawerRef.handleToggleDrawer()},a.handleMenuClose=function(){a.handleMobileMenuClose()},a.handleMobileMenuOpen=function(e){a.setState({mobileMoreAnchorEl:e.currentTarget})},a.handleMobileMenuClose=function(){a.setState({mobileMoreAnchorEl:null})},a}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this,t=this.state.mobileMoreAnchorEl,a=this.props.classes,n=Boolean(t),r=l.a.createElement(E.q,{anchorEl:t,anchorOrigin:{vertical:"top",horizontal:"right"},transformOrigin:{vertical:"top",horizontal:"right"},open:n,onClose:this.handleMenuClose},l.a.createElement(E.r,{onClick:this.handleMobileMenuClose},l.a.createElement(E.m,{color:"inherit"},l.a.createElement(w.a,null)),l.a.createElement("p",null,"Examples")),l.a.createElement(E.r,{onClick:this.handleMobileMenuClose},l.a.createElement(E.m,{color:"inherit"},l.a.createElement(C.a,null)),l.a.createElement("p",null,"Video Tutorial")),l.a.createElement(E.r,{onClick:this.handleMobileMenuClose},l.a.createElement(E.m,{color:"inherit"},l.a.createElement(E.t,null,l.a.createElement("path",{d:"M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"}))),l.a.createElement("p",null,"Github")));return l.a.createElement("div",{className:a.root},l.a.createElement(E.a,{position:"static",style:{backgroundColor:"#212734"}},l.a.createElement(E.v,null,l.a.createElement(E.m,{className:a.menuButton,color:"inherit","aria-label":"Open drawer",onClick:this.handleToggleDrawer},l.a.createElement(b.a,null)),l.a.createElement(E.x,{className:a.title,variant:"h6",color:"inherit",noWrap:!0},"Automata Playground"),l.a.createElement(E.x,{className:a.title,variant:"caption"},l.a.createElement("a",{href:"#notice",style:{textDecoration:"none",color:"white"}},"\xa0Alpha")),l.a.createElement("div",{className:a.grow}),l.a.createElement("div",{className:a.sectionDesktop},l.a.createElement(E.w,{title:"Examples"},l.a.createElement(E.m,{color:"inherit"},l.a.createElement(w.a,null))),l.a.createElement(E.w,{title:"Video Tutorial"},l.a.createElement(E.m,{color:"inherit"},l.a.createElement(C.a,null))),l.a.createElement(E.w,{title:"Github"},l.a.createElement(E.m,{color:"inherit"},l.a.createElement(E.t,null,l.a.createElement("path",{d:"M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"}))))),l.a.createElement("div",{className:a.sectionMobile},l.a.createElement(E.m,{"aria-haspopup":"true",onClick:this.handleMobileMenuOpen,color:"inherit"},l.a.createElement(k.a,null))))),r,l.a.createElement(N,{innerRef:function(t){e.TemporaryDrawerRef=t}}))}}]),t}(l.a.Component),j=Object(g.withStyles)(function(e){return{root:{width:"100%"},grow:{flexGrow:1},menuButton:{marginLeft:-12,marginRight:20},title:Object(h.a)({display:"none"},e.breakpoints.up("sm"),{display:"block"}),sectionDesktop:Object(h.a)({display:"none"},e.breakpoints.up("md"),{display:"flex"}),sectionMobile:Object(h.a)({display:"flex"},e.breakpoints.up("md"),{display:"none"})}})(x),M=a(46),A=new M.DataSet([{id:1,label:"Node 1"},{id:2,label:"Node 2"},{id:3,label:"Node 3"},{id:4,label:"Node 4"},{id:5,label:"Node 5"}]),L=new M.DataSet([{from:1,to:3,label:"a",smooth:{type:"curvedCW",roundness:0}},{from:1,to:2,label:"b",smooth:{type:"curvedCW",roundness:0}},{from:2,to:4,label:"c",smooth:{type:"curvedCW",roundness:0}},{from:2,to:5,label:"d",smooth:{type:"curvedCW",roundness:.1}},{from:5,to:2,label:"e",smooth:{type:"curvedCW",roundness:.1}},{from:2,to:2,label:"f"}]),S={nodes:A,edges:L},T=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).handleNodeDialogOpen=function(){a.setState({nodeDialogOpen:!0})},a.handleNodeDialogClose=function(){a.setState({nodeDialogOpen:!1,labelError:!1}),A.remove(A.getIds()[A.length-1])},a.handleNodeDialogEnterClose=function(){var e=a.state.nodeLabel;""!==e?(A.update({id:A.getIds()[A.length-1],label:e}),a.setState({nodeDialogOpen:!1,labelError:!1,nodeLabel:""})):a.setState({labelError:!0})},a.handleNodeLabelChange=function(e){a.setState({nodeLabel:e.target.value})},a.handleEdgeDialogOpen=function(){a.setState({edgeDialogOpen:!0})},a.handleEdgeDialogClose=function(){a.setState({edgeDialogOpen:!1,labelError:!1}),L.remove(L.getIds()[L.length-1])},a.handleEdgeDialogEnterClose=function(){var e=a.state.edgeLabel;""===e||/\s/g.test(e)?a.setState({labelError:!0}):(L.update({id:L.getIds()[L.length-1],label:e}),a.setState({edgeDialogOpen:!1,labelError:!1,edgeLabel:""}))},a.handleEdgeLabelChange=function(e){a.setState({edgeLabel:e.target.value})},a.network={},a.visRef=l.a.createRef(),a.state={edgeDialogOpen:!1,edgeLabel:"",labelError:!1,nodeDialogOpen:!1,nodeLabel:""},a}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this,t={clickToUse:!0,nodes:{shape:"circle"},edges:{arrows:{to:{enabled:!0,scaleFactor:1,type:"arrow"}},smooth:{type:"curvedCW",roundness:0}},physics:{enabled:!1},manipulation:{addEdge:function(t,a){e.handleEdgeDialogOpen(),a(t)}}};this.network=new M.Network(this.visRef,S,t),this.visRef.focus();var a=Object(M.keycharm)({container:this.visRef,preventDefault:!0});this.network.on("click",function(){e.visRef.focus()}),this.network.on("doubleClick",function(t){A.add({label:"",x:t.pointer.canvas.x,y:t.pointer.canvas.y}),e.handleNodeDialogOpen()}),a.bind("delete",function(){var t=e.network.getSelection();t.nodes[0]||L.remove(t.edges[0]),A.remove(t.nodes[0])}),a.bind("shift",function(){e.network.addEdgeMode()},"keydown"),a.bind("shift",function(){e.network.disableEditMode()},"keyup")}},{key:"render",value:function(){var e=this,t=this.props.classes,a=this.state,n=a.edgeDialogOpen,r=a.labelError,o=a.nodeDialogOpen;return l.a.createElement("div",{className:t.root},l.a.createElement(E.l,{container:!0,spacing:16},l.a.createElement(E.l,{item:!0,lg:9,xs:12},l.a.createElement(E.s,{className:t.paper,elevation:6},l.a.createElement("div",{tabIndex:0,ref:function(t){e.visRef=t},className:t.divCanvas}))),l.a.createElement(E.l,{item:!0,lg:3,xs:12},l.a.createElement(E.s,{className:t.paper,elevation:6},l.a.createElement("div",{className:t.divUtil},"tools")))),l.a.createElement(E.e,{open:o,onClose:this.handleNodeDialogClose,"aria-labelledby":"node-form-dialog-title"},l.a.createElement(E.i,{id:"node-form-dialog-title"},"Node"),l.a.createElement(E.g,null,l.a.createElement(E.h,null,"Please enter a label for your new node"),r?l.a.createElement(E.h,{style:{color:"red"}},"Label cannot be empty or include space"):"",l.a.createElement(E.u,{autoFocus:!0,autoComplete:"off",margin:"dense",id:"nodelabel",onChange:this.handleNodeLabelChange,fullWidth:!0})),l.a.createElement(E.f,null,l.a.createElement(E.b,{onClick:this.handleNodeDialogClose,color:"primary"},"Cancel"),l.a.createElement(E.b,{onClick:this.handleNodeDialogEnterClose,color:"primary"},"Enter"))),l.a.createElement(E.e,{open:n,onClose:this.handleEdgeDialogClose,"aria-labelledby":"edge-form-dialog-title"},l.a.createElement(E.i,{id:"edge-form-dialog-title"},"Edge"),l.a.createElement(E.g,null,l.a.createElement(E.h,null,"Please enter a label for your new edge"),r?l.a.createElement(E.h,{style:{color:"red"}},"Label cannot be empty or include space"):"",l.a.createElement(E.u,{autoFocus:!0,autoComplete:"off",margin:"dense",id:"edgelabel",onChange:this.handleEdgeLabelChange,fullWidth:!0})),l.a.createElement(E.f,null,l.a.createElement(E.b,{onClick:this.handleEdgeDialogClose,color:"primary"},"Cancel"),l.a.createElement(E.b,{onClick:this.handleEdgeDialogEnterClose,color:"primary"},"Enter"))))}}]),t}(l.a.Component),R=Object(g.withStyles)(function(e){return{root:{flexGrow:1,marginTop:2*e.spacing.unit,marginLeft:2*e.spacing.unit,marginRight:2*e.spacing.unit},paper:{padding:e.spacing.unit},divCanvas:Object(h.a)({height:.8*window.innerHeight},e.breakpoints.down("md"),{height:.7*window.innerHeight}),divUtil:Object(h.a)({height:.8*window.innerHeight},e.breakpoints.down("md"),{height:.3*window.innerHeight})}})(T),I=Object(g.withStyles)(function(e){return{root:{padding:2*e.spacing.unit,margin:2*e.spacing.unit}}})(function(e){var t=e.classes;return l.a.createElement("div",null,l.a.createElement(E.c,{className:t.root,id:"notice",elevation:6},l.a.createElement(E.d,null,l.a.createElement(E.x,{variant:"title",gutterBottom:!0},"How to get hands dirty"),l.a.createElement(E.x,{variant:"body2"},"Create a Node"),l.a.createElement(E.x,{variant:"body1"},"Double click to create a node",l.a.createElement("br",null)),l.a.createElement(E.x,{variant:"body2"},"Create an Edge"),l.a.createElement(E.x,{variant:"body1"},"Press and hold down shift button, then click-drag from one node to other node you wish to join",l.a.createElement("br",null)),l.a.createElement(E.x,{variant:"body2"},"Delete ?"),l.a.createElement(E.x,{variant:"body1"},"Just select the object you want to delete and press 'delete' key!",l.a.createElement("br",null)))),l.a.createElement(E.c,{className:t.root,id:"notice",elevation:6},l.a.createElement(E.d,null,l.a.createElement(E.x,{variant:"title",gutterBottom:!0},"Alpha Release"),l.a.createElement(E.x,{variant:"body1"},"Application is in active development phase",l.a.createElement("br",null),"This web application is currently in the stages of its development.",l.a.createElement("br",null),"It has some quirks and many parts are not yet available.",l.a.createElement("br",null),"We are working hard to finalize the Application's structure, and roughly once every two weeks we roll out new functionality towards this goal.",l.a.createElement("br",null),"Until then you may notice that some resources move or even disappear for a while."))))}),W=a(64),F=Object(g.withStyles)(function(e){return{root:{backgroundColor:"#4D4D4D",color:"#ffffff"},container:Object(h.a)({padding:8*e.spacing.unit},e.breakpoints.down("sm"),{padding:3*e.spacing.unit,marginLeft:e.spacing.unit}),title:{marginBottom:2*e.spacing.unit},about:{color:"#ffffff",paddingBottom:e.spacing.unit,textAlign:"center"},icons:{color:"#ffffff"}}})(function(e){var t=e.classes,a=[[l.a.createElement(E.w,{title:"website",className:t.icons},l.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://nihalmurmu.me"},l.a.createElement(E.m,{color:"inherit"},l.a.createElement(W.b,null))))],[l.a.createElement(E.w,{title:"mail",className:t.icons},l.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"mailto:nhlmrm@gmail.com"},l.a.createElement(E.m,{color:"inherit"},l.a.createElement(W.c,null))))],[l.a.createElement(E.w,{title:"twitter",className:t.icons},l.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://twitter.com/nihalmurmu"},l.a.createElement(E.m,{color:"inherit"},l.a.createElement("ion-icon",{name:"logo-twitter"}))))],[l.a.createElement(E.w,{title:"linkedin",className:t.icons},l.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://linkedin.com/in/nihalmurmu"},l.a.createElement(E.m,{color:"inherit"},l.a.createElement("ion-icon",{name:"logo-linkedin"}))))],[l.a.createElement(E.w,{title:"github",className:t.icons},l.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://github.com/nihalmurmu"},l.a.createElement(E.m,{color:"inherit"},l.a.createElement("ion-icon",{name:"logo-github"}))))],[l.a.createElement(E.w,{title:"resume",className:t.icons},l.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://nihalmurmu.me/resume.pdf"},l.a.createElement(E.m,{color:"inherit"},l.a.createElement(W.a,null))))]];return l.a.createElement(E.s,{elevation:0,square:!0,className:t.root},l.a.createElement(E.l,{container:!0,className:t.container},l.a.createElement(E.l,{item:!0,lg:3,md:3}),l.a.createElement(E.l,{item:!0,lg:9,md:9,xs:12,className:t.title},l.a.createElement(E.x,{variant:"h5",component:"h3",color:"inherit"},"Quick Links")),l.a.createElement(E.l,{item:!0,lg:3,md:3}),l.a.createElement(E.l,{item:!0,lg:3,md:3,xs:12},l.a.createElement(E.x,{variant:"subtitle1"},l.a.createElement("a",{href:"https://github.com/nihalmurmu/Automata",style:{textDecoration:"none",color:"white"}},"Github"))),l.a.createElement(E.l,{item:!0,lg:3,md:3,xs:12},l.a.createElement(E.x,{variant:"subtitle1"},l.a.createElement("a",{href:"https://github.com/nihalmurmu/Automata",style:{textDecoration:"none",color:"white"}},"Examples"))),l.a.createElement(E.l,{item:!0,lg:3,md:3}),l.a.createElement(E.l,{item:!0,lg:3,md:3}),l.a.createElement(E.l,{item:!0,lg:3,md:3,xs:12},l.a.createElement(E.x,{variant:"subtitle1"},l.a.createElement("a",{href:"https://github.com/nihalmurmu/Automata",style:{textDecoration:"none",color:"white"}},"Tutorial"))),l.a.createElement(E.l,{item:!0,lg:3,md:3,xs:12},l.a.createElement(E.x,{variant:"subtitle1"},l.a.createElement("a",{href:"https://github.com/nihalmurmu/Automata",style:{textDecoration:"none",color:"white"}},"Any suggestion?"))),l.a.createElement(E.l,{item:!0,lg:3,md:3})),l.a.createElement("div",{className:t.about},l.a.createElement(E.x,{variant:"overline",color:"inherit"},l.a.createElement("a",{href:"https://nihalmurmue.me",style:{textDecoration:"none",color:"white"}},"\xa9 Nihal Murmu 2018-2019")),l.a.createElement(E.l,{container:!0,justify:"center",spacing:16},a.map(function(e){return l.a.createElement(E.l,{item:!0},e)}))))}),B=function(e){function t(){return Object(i.a)(this,t),Object(s.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){u.a.initialize("UA-138685124-2"),u.a.pageview(window.location.pathname)}},{key:"render",value:function(){return l.a.createElement("div",{className:"App"},l.a.createElement(j,null),l.a.createElement(R,null),l.a.createElement(I,null),l.a.createElement(F,null))}}]),t}(l.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(l.a.createElement(B,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[5425,1,2]]]);