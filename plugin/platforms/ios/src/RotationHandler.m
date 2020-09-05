//
//  RotationHandler.m
//  GestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "RotationHandler.h"

@implementation RotationGestureHandler

- (instancetype)initWithTag:(NSNumber *)tag
{
    if ((self = [super initWithTag:tag])) {
        #if !TARGET_OS_TV
        _recognizer = [[UIRotationGestureRecognizer alloc] initWithTarget:self action:@selector(handleGesture:)];
        #endif
    }
    return self;
}

#if !TARGET_OS_TV
- (NSMutableDictionary *)eventExtraData:(UIRotationGestureRecognizer *)recognizer
{
  NSMutableDictionary* result = [super eventExtraData:recognizer];
  [result setObject:@(recognizer.velocity) forKey:@"velocity"];
  [result setObject:@(recognizer.rotation) forKey:@"rotation"];
  [result setObject:[result objectForKey:@"x"] forKey:@"anchorX"];
  [result setObject:[result objectForKey:@"y"] forKey:@"anchorY"];
  return result;
}
#endif

@end

