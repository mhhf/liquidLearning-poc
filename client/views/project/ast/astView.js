Template.projectAstView.display = function(){
  if(this.name == '???')
    return Template['pkg_tts_view'];
  else if( this.name == 'md' )
    return Template['pkg_md_view'];
  else
    return Template['astDefaultDisplay'];
};
