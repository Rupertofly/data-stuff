precision mediump float;
varying vec2 uv;
uniform vec3 col_map[128];
uniform sampler2D colour;
vec3 hue2rgb(float hue){
  hue=fract(hue);//only use fractional part of hue, making it loop
  float r=abs(hue*6.-3.)-1.;//red
  float g=2.-abs(hue*6.-2.);//green
  float b=2.-abs(hue*6.-4.);//blue
  vec3 rgb=vec3(r,g,b);//combine components
  rgb=clamp(rgb,0.,1.);//clamp between 0 and 1
  return rgb;
}
vec3 hsv2rgb(vec3 hsv)
{
  vec3 rgb=hue2rgb(hsv.x);//apply hue
  rgb=mix(vec3(1),rgb,hsv.y);//apply saturation
  rgb=rgb*hsv.z;//apply value
  return rgb;
}

void main(){
  
  vec3 c1=vec3(.433-1.,1.,.96);
  vec3 c2=vec3(.76,.86,.29);
  vec3 color=mix(c1,c2,uv.x);
  gl_FragColor=vec4(hsv2rgb(color),1.);
}